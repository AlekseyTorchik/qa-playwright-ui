import {Locator, Page} from "@playwright/test";
import {BasePage} from "./BasePage";

export class SearchPage extends BasePage {
    readonly mainPageUrl: string = "/ringtones-and-wallpapers";
    readonly searchField: Locator;
    readonly categoryItem: Locator;
    readonly searchButton: Locator;
    readonly searchResultsList: (input: string) => Locator;
    readonly cookiePopup: Locator;
    readonly cookieButton: Locator;
    readonly selectedCategory: (category: string) => Locator;
    readonly loadMoreButton: Locator;
    readonly searchResultTitleText: (input: string) => Locator;
    readonly item: Locator;
    readonly itemPremium: Locator;
    readonly itemAspect: Locator;

    constructor(page: Page) {
        super(page);
        this.categoryItem = page.locator("div[class*='Search_search-category'][data-hide='true']");
        this.selectedCategory = (category: string): Locator =>
            this.page.locator(`div[class*='dropdown-container'] div[role='menuitemradio'] label:text-is("${category}")`);
        this.searchField = page.locator("h1[data-appearance='primary'] + form input[id='search']");
        this.searchButton = page.getByRole('main').getByRole('button', {name: 'Search'});
        this.searchResultTitleText = (input: string): Locator =>
            this.page.locator(`h1 > span:text-is("${input}")`);
        this.loadMoreButton = page.locator("button[data-event*='CLICK_LOAD_MORE']");
        this.searchResultsList = (input: string): Locator =>
            page.locator(`div[class*=cards-container-items] a[aria-label*="${input}"]`);
        this.cookiePopup = page.locator("div[class*='didomi-popup-container']");
        this.cookieButton = page.getByLabel("reject optional cookies");
        this.item = page.locator("div[class*='card']");
        this.itemAspect = page.locator("> div[class*='aspect']");
        this.itemPremium = page.locator("div[class*='card-header'] span[style*='premium']")
    }

    async goTo() {
        await this.page.goto(this.mainPageUrl);
    }

    async selectCategory(category: string) {
        await this.categoryItem.click();
        await this.selectedCategory(category).click();
    }

    async searchResults(input: string): Promise<number> {
        const resultList: Locator = this.searchResultsList(input);
        await resultList.waitFor({ timeout: 5000 }).catch(async () => {
        });
        return await resultList.count();
    }

    async isTitleVisible(input: string): Promise<boolean> {
        try {
            await this.searchResultTitleText(input).waitFor({ state: 'visible', timeout: 4000 });
            return await this.searchResultTitleText(input).isVisible();
        } catch {
            return false;
        }
    }

    async manageCookiePoup() {
        await this.cookiePopup.waitFor({ state: 'visible', timeout: 4000 }).catch(async () => {
        });
        if (await this.cookiePopup.isVisible()) {
            await this.cookieButton.click();
        }
    }

    async submitSearch(keyword: string) {
        await this.searchField.fill(keyword);
        await this.searchButton.click();
    }

    async getFreeItems(): Promise<Locator> {
        const allItems: Locator = this.item;
        const candidates: Locator = allItems.filter({
            has: this.itemAspect
        });
        return candidates.filter({
            hasNot: this.page.locator('div[class*="card-header"]')
        });
    }

    async countFreeItems(): Promise<number> {
        const freeItems: Locator= await this.getFreeItems();
        return freeItems.count();
    }

    async getPremiumItems(): Promise<Locator> {
        const allItems: Locator = this.item;
        return allItems.filter({
            has: this.itemPremium
        });
    }

    async countPremiumItems(): Promise<number> {
        const premiumItems: Locator= await this.getPremiumItems();
        return premiumItems.count();
    }

    async downloadFreeItem(): Promise<number> {
        const freeItems: Locator = await this.getFreeItems();
        const allItems = this.item;
        const premiumItems = allItems.filter({
            has: this.itemPremium,
        });
        return premiumItems.count();
    }
}
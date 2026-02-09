import {Locator, Page} from "@playwright/test";
import {BasePage} from "./BasePage";

export class SearchPage extends BasePage {
    readonly mainPageUrl: string = "/ringtones-and-wallpapers";
    readonly searchField: Locator;
    readonly categoryItem: Locator;
    readonly searchButton: Locator;
    readonly searchResultsList: Locator;
    readonly cookiePopup: Locator;
    readonly cookieButton: Locator;
    readonly selectedCategory: Locator;
    readonly searchResultTitle: Locator;
    readonly loadMoreButton: Locator;

    constructor(page: Page) {
        super(page);
        this.categoryItem = page.locator("div[class*='Search_search-category'][data-hide='true']");
        this.selectedCategory = page.locator("div[class*='dropdown-container'] div[role='menuitemradio']");
        this.searchField = page.locator("h1[data-appearance='primary'] + form input[id='search']");
        this.searchButton = page.getByRole('main').getByRole('button', {name: 'Search'});
        this.searchResultTitle = page.locator("h1");
        this.loadMoreButton = page.locator("button[data-event*='CLICK_LOAD_MORE']");
        this.searchResultsList = page.locator("div[data-direction='column'][class*='scrollbar']");
        this.cookiePopup = page.locator("div[class*='didomi-popup-container']");
        this.cookieButton = page.getByLabel("reject optional cookies");
    }

    async goTo() {
        await this.page.goto(this.mainPageUrl);
    }

    async selectCategory(category: string) {
        await this.categoryItem.click();
        await this.selectedCategory.locator(`label:text-is("${category}")`).click();

    }

    async searchResults(input: string): Promise<number> {
        await this.searchResultTitle.locator(`span:text-is("${input}")`).isVisible();
        await this.loadMoreButton.isVisible();
        const resultList = this.searchResultsList.locator(`a[aria-label*="${input}"]`);
        await resultList.waitFor({ timeout: 5000 }).catch(async () => {
        });
        return await resultList.count();
    }

    async manageCookiePoup() {
        await this.cookiePopup.waitFor({ state: 'visible', timeout: 3000 }).catch(async () => {
        });
        if (await this.cookiePopup.isVisible()) {
            await this.cookieButton.click();
        }
    }

    async submitSearch(keyword: string) {
        await this.searchField.fill(keyword);
        await this.searchButton.click();
    }
}
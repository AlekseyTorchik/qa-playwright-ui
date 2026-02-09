import {BasePage} from "./BasePage";
import {Download, Locator, Page} from "@playwright/test";

export class ItemPage extends BasePage {
    readonly itemHeading: Locator;
    readonly downloadButton: Locator;
    readonly counter: Locator;
    static timeoutMax: number = 20000;

    constructor(page: Page) {
        super(page);
        this.itemHeading = page.locator("div[class*='items-center'] + h1");
        this.downloadButton = page.getByRole('button', {name: 'Download', exact: true});
        this.counter = page.locator("div[class*='modal-body'] div[class*='rounded-full']")
    }

    async downloadFreeItem(): Promise<string> {
        let itemTitle: string;
        if (await this.itemHeading.isVisible()){
            itemTitle = await this.itemHeading.textContent();
        }
        const downloadFreeItem: Promise<Download> = this.page.waitForEvent('download');
        await this.downloadButton.click();
        await this.waitForCounterGone();
        const download: Download = await downloadFreeItem;
        return await download.path();
    }

    async waitForCounterGone() {
        while (true) {
            const count = await this.counter.count();
            if (count === 0) break;
            await this.page.waitForTimeout(500);
            ItemPage.timeoutMax -= 500;
            if (ItemPage.timeoutMax <= 0) throw new Error('Counter timeout');
        }
    }

}

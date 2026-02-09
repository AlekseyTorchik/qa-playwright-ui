import {Page} from "@playwright/test";

export class BasePage {
    readonly page: Page;
    readonly mainPageUrl: string;

    constructor(page: Page) {
        this.page = page;
    }

    async goTo() {
        await this.page.goto('');
    }
}
import {test, expect} from '@playwright/test';
import {SearchPage} from "../src/pages/SearchPage";
import {downloadScenarios, searchScenarios, verifyItemsScenarios} from '../test-data/test-scenarios.js';
import {ItemPage} from "../src/pages/ItemPage";

test.describe("Search results test", async () => {
    let searchPage: SearchPage;
    let itemPage: ItemPage;
    const zeroValue: number = 0;

    test.beforeEach(async ({page}) => {
        searchPage = new SearchPage(page);
        await searchPage.goTo();
        await searchPage.manageCookiePoup();
    });

    for (const {
        description, category,
        keyword, expectedMinResults
    } of searchScenarios) {

        test(`${description}`, async () => {
            await searchPage.selectCategory(category);
            await searchPage.submitSearch(keyword);
            const isTitleVisible: boolean = await searchPage.isTitleVisible(keyword);
            expect(isTitleVisible).toBeTruthy();
            const resultList: number = await searchPage.searchResults(keyword);
            if (expectedMinResults === zeroValue) {
                expect(resultList).toBe(expectedMinResults)
            }
            if (expectedMinResults > zeroValue) {
                expect(resultList).toBeGreaterThan(expectedMinResults)
            }
        });
    }

    for (const {
        description, category, keyword,
        expectedMinSearchResults, expectedMinFree, expectedMinPremium
    } of verifyItemsScenarios) {

        test(`${description}`, async ({page}) => {
            await searchPage.selectCategory(category);
            await searchPage.submitSearch(keyword);
            const isTitleVisible: boolean = await searchPage.isTitleVisible(keyword);
            expect(isTitleVisible).toBeTruthy();
            const resultList: number = await searchPage.searchResults(keyword);
            if (resultList > expectedMinSearchResults) {
                const freeItemsCount: number = await searchPage.countFreeItems();
                expect(freeItemsCount).toBeGreaterThan(expectedMinFree);
                const premiumItemsCount: number = await searchPage.countPremiumItems();
                expect(premiumItemsCount).toBeGreaterThan(expectedMinPremium);
            }
            expect(resultList).toBeGreaterThan(expectedMinSearchResults)
        });
    }

    for (const {
        description, category, keyword,
        expectedMinSearchResults, expectedMinFree, artifactsPath
    } of downloadScenarios) {

        test(`${description}`, async ({page}) => {
            await searchPage.selectCategory(category);
            await searchPage.submitSearch(keyword);
            const isTitleVisible: boolean = await searchPage.isTitleVisible(keyword);
            expect(isTitleVisible).toBeTruthy();
            const resultList: number = await searchPage.searchResults(keyword);
            const freeItemsCount: number = await searchPage.countFreeItems();
            await searchPage.clickFreeItem();
            itemPage = new ItemPage(page);
            if (resultList > expectedMinSearchResults && freeItemsCount > expectedMinFree) {
                const path:string = await itemPage.downloadFreeItem();
                expect(path).toContain(artifactsPath);
            }
            expect(resultList > expectedMinSearchResults).toBeTruthy();
            expect(freeItemsCount > expectedMinFree).toBeTruthy();
        });
    }


})
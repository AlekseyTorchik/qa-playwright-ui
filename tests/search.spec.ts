import {test, expect} from '@playwright/test';
import {SearchPage} from "../src/pages/SearchPage";
import {searchScenarios, verifyItemsScenarios} from '../test-data/test-scenarios.js';

test.describe("Search results test", async () => {
    let searchPage: SearchPage;
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

        test(`${description}`, async ({page}) => {
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
                const freeItemsLocators: number = await searchPage.countFreeItems();
                expect(freeItemsLocators).toBeGreaterThan(expectedMinFree);
                const premiumItemsLocators: number = await searchPage.countPremiumItems();
                expect(premiumItemsLocators).toBeGreaterThan(expectedMinPremium);
            }
            expect(resultList).toBeGreaterThan(expectedMinSearchResults);
        });
    }



})
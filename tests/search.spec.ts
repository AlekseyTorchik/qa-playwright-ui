import {test, expect} from '@playwright/test';
import {SearchPage} from "../src/pages/SearchPage";
import {testScenarios} from '../test-data/test-scenarios.js';

test.describe("Search results test", async () => {
    let searchPage: SearchPage;
    for (const {description, category, keyword, expectedMinResult} of testScenarios) {

        test.beforeEach(async ({page}) => {
            searchPage = new SearchPage(page);
            await searchPage.goTo();
            await searchPage.manageCookiePoup();
        });

        test(`${description}`, async ({page}) => {
            await searchPage.selectCategory(category);
            await searchPage.submitSearch(keyword);
            const resultList = await searchPage.searchResults(keyword);
            if (expectedMinResult === 0) {
                expect(resultList).toBe(expectedMinResult)
            }
            if (expectedMinResult > 0) {
                expect(resultList).toBeGreaterThan(expectedMinResult)
            }
        });
    }
})
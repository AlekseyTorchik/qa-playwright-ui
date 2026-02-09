# Playwright automation

## Requirements
In order to utilise this project you need to have the following installed locally:

- Node.js (v22.19.0 or later)

## Usage
The project is broken into separate modules test scenarios. Each of these modules can be utilised independently.

Navigate to qa-playwright-ui directory beforehand. 
Create .env file locally in the project directory with the following structure.

```
BASE_URL=***
```
## Install playwright
```
npm init playwright@latest
```
To run the tests scope using chromium in headless mode use:
```
npm test:ui
```
To run a specific tests using chromium in headless mode use:
```
npm test:ui:verifyFreeAndPremium
```
```
npm test:ui:downloadFreeItem
```
## Reporting
Reports are written into /playwright-report directories after the failed run. To open a last report use:
```
npm report
```
If sharing a trace files from /test-results directory with others, then they can drag and drop trace.zip to the [Playwright Trace Viewer](https://trace.playwright.dev/) for reviewing.
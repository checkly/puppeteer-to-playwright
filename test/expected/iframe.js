const { chromium } = require('playwright');
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const expect = require('chai').expect;

const elementHandle = await page.$('iframe');
const frame = await elementHandle.contentFrame();

const Message = await frame.$eval('.filters-bar-label', (ele) => ele.textContent);
expect(Message).to.contains('Filters');

await browser.close();

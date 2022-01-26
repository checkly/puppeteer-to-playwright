const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
const navigationPromise = page.waitForNavigation();
const expect = require('chai').expect;

const elementHandle = await page.$('iframe');
const frame = await elementHandle.contentFrame();

const Message = await frame.$eval('.filters-bar-label', (ele) => ele.textContent);
expect(Message).to.contains('Filters');

await browser.close();

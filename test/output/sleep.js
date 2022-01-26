const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
const navigationPromise = page.waitForNavigation();
const expect = require('chai').expect;

await sleep(1500);

await page.waitForSelector('#analytics-nav-component');

await sleep(1500);

await page.click('#analytics-nav-component');

await sleep(10000);

await page.screenshot({ path: 'n_screenshot.png' });

await browser.close();

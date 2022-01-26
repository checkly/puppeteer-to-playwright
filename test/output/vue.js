const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto('https://v3.vuejs.org/');

	await page.setViewport({ width: 1680, height: 887 });

	await page.waitForSelector('.hero > .inner > .right > .actions > .nav-link:nth-child(2)');
	await page.click('.hero > .inner > .right > .actions > .nav-link:nth-child(2)');

	await page.waitForSelector('.theme-container > .page > .theme-default-content > p > .nav-link');
	await page.click('.theme-container > .page > .theme-default-content > p > .nav-link');

	await page.waitForSelector('.page > .theme-default-content > ol > li:nth-child(4) > a');
	await page.click('.page > .theme-default-content > ol > li:nth-child(4) > a');

	await page.waitForSelector('.theme-container > .page > .theme-default-content > p:nth-child(31) > a:nth-child(1)');
	await page.click('.theme-container > .page > .theme-default-content > p:nth-child(31) > a:nth-child(1)');

	await browser.close();
})();

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://google.com');

	await page.waitForSelector('#L2AGLb');
	await page.click('#L2AGLb');
	await page.waitForNavigation();

	let cookies = await page.cookies();
	const cookieJson = JSON.stringify(cookies);

	fs.writeFileSync('cookies.json', cookieJson);

	cookies = fs.readFileSync('cookies.json', 'utf8');

	const deserializedCookies = JSON.parse(cookies);
	await page.setCookie(...deserializedCookies);

	await browser.close();
})();

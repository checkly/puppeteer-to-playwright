import { chromium } from 'playwright';

describe('App.js', () => {
	let browser;
	let page;

	beforeAll(async () => {
        browser = await chromium.launch();
        const context = await browser.newContext();
        page = await context.newPage();
    });

	it('contains the welcome text', async () => {
        await page.goto('http://localhost:5000');
        const text = await page.$eval('.App-welcome-text', (e) => e.textContent);
        expect(text).toContain('Edit src/App.js and save to reload.');
    });

	afterAll(() => browser.close());
});

const { chromium } = require('playwright');
const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()
const expect = require('chai').expect

await page.click('#analytics-nav-component')

await page.screenshot({ path: 'n_screenshot.png' })

await browser.close()
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({headless: false})
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('https://v3.vuejs.org/')

    await page.setViewportSize({ width: 1680, height: 887 })

    await page.click('.hero > .inner > .right > .actions > .nav-link:nth-child(2)')

    await page.click('.theme-container > .page > .theme-default-content > p > .nav-link')

    await page.click('.page > .theme-default-content > ol > li:nth-child(4) > a')

    await page.click('.theme-container > .page > .theme-default-content > p:nth-child(31) > a:nth-child(1)')

    await browser.close()
})()
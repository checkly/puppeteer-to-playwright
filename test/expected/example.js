const { chromium } = require('playwright')
const screenshot = 'shopping_staples.png'
try {
  (async () => {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('https://www.staples.com/Painting-Supplies/cat_CL140420/bww15', { waitUntil: 'networkidle2' })
    await page.click('button.add-to-cart-btn.addToCart')
    await page.screenshot({ path: screenshot })
    await browser.close()
    console.log('See screen shot: ' + screenshot)
  })()
} catch (err) {
  console.error(err)
}
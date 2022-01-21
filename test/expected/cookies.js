const { chromium } = require('playwright')
const fs = require('fs');

(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto("https://google.com")

  await page.click('#L2AGLb')
  await page.waitForNavigation()

  let cookies = await await context.cookies()
  const cookieJson = JSON.stringify(cookies)

  fs.writeFileSync('cookies.json', cookieJson)

  cookies = fs.readFileSync('cookies.json', 'utf8')

  const deserializedCookies = JSON.parse(cookies)
  // TODO: ensure the following line references the right context
  await browserContext.addCookies(deserializedCookies)

  await browser.close()
})()
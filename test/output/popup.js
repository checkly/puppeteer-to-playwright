const assert = require('chai').assert;
const puppeteer = require('puppeteer');
(async()=>{

    const browser = await puppeteer.launch({ });
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation()
    
    await page.goto('https://www.url.com')

    await page.waitForSelector('.Product-options-main #form-action-addToCart')
    await page.click('.Product-options-main #form-action-addToCart')

    await page.waitForSelector('.modal-content > .modal-body > .previewCart > .previewCartCheckout > .button:nth-child(6)')
    await page.click('.modal-content > .modal-body > .previewCart > .previewCartCheckout > .button:nth-child(6)')

    await navigationPromise

    try{
        await page.waitForSelector('.popup_close')
        await page.click('.popup_close')
    }catch(e){}

    await page.waitForSelector('.page > .page-content--full > .cart_actionbutton:nth-child(8) > .cart-actions > .button--primary')
    await page.click('.page > .page-content--full > .cart_actionbutton:nth-child(8) > .cart-actions > .button--primary')

    await navigationPromise

    await page.waitForSelector('#cart-edit-link')
    await page.click('#cart-edit-link')

    await navigationPromise

    await page.screenshot({ path: 'checkout.jpg' })

    await browser.close()
})()
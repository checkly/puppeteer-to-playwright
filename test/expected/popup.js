const assert = require('chai').assert;
const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.url.com');

    await page.click('.Product-options-main #form-action-addToCart');

    await page.click('.modal-content > .modal-body > .previewCart > .previewCartCheckout > .button:nth-child(6)');

    try {
        await page.click('.popup_close');
    } catch (e) {}

    await page.click('.page > .page-content--full > .cart_actionbutton:nth-child(8) > .cart-actions > .button--primary');

    await page.click('#cart-edit-link');

    await page.screenshot({ path: 'checkout.jpg' });

    await browser.close();
})();

const { test } = require('@playwright/test');
const { chromium } = require('playwright');
const assert = require('assert');

test('checkerstest', async ({ page }) => {

    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext();
    const response = await page.goto('https://www.gamesforthebrain.com/game/checkers/');
    const statusCode = response.status();
    console.log(`Status code: ${statusCode}`);
    assert.strictEqual(statusCode, 200, `Expected status code 200, but got ${statusCode}`);
    /*
    This will go to the page and deliver a response status to verify 
    that the page is up and returning a 200 code
    */
    await page.locator('div:nth-child(6) > img:nth-child(8)').click();
    await page.locator('div:nth-child(5) > img:nth-child(7)').click();
    const element = await page.waitForSelector('text=Make a move.');
    await page.waitForTimeout(2000);
    assert.ok(element !== null, 'Selector not found on page.');
    await page.locator('div:nth-child(7) > img:nth-child(7)').click();
    await page.locator('div:nth-child(6) > img:nth-child(8)').click();
    await page.waitForTimeout(2000);
    assert.ok(element !== null, 'Selector not found on page.');
    await page.locator('div:nth-child(8) > img:nth-child(8)').click();
    await page.locator('div:nth-child(7) > img:nth-child(7)').click();
    await page.getByRole('link', { name: 'Restart...' }).click();
    const elementOrange = await page.waitForSelector('text=Select an orange piece to move.')
    assert.ok(elementOrange !== null, 'Selector not found on page.');

    /* 
    You will only be able to make 3 moves without running into scenarios 
    where the opponents checkers are in space that you attempt to 
    place a your checker into, and because of the nature of the game of 
    checkers you will never be able to automate a scenario where you can 
    simulate taking a blue piece because of the random nature of the 
    opponnets moves and never being able to fully flesh out a scenario where
    you can predetermine where your opponents blue piece will be.
 
    As well, using "make a move" as an indicator that you can go would not work because 
    while the opponent is placing their piece the text still appears and 
    stays on screen from the time you move your first piece. If we were 
    determined to do this we could give the test a pause between turns 
    and verify that the text does indeed still appear on page. This is the 
    reason I added page wait for timeouts, in addition to the fact that it
    allows the opponent enough time to finish their move.
    */
    // ---------------------
    await context.close();
    await browser.close();
});

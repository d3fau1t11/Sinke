import { test, expect, loginDemo } from './demoHelpers';

test('merchant can prepare orders, edit a menu price, toggle availability and sign out', async ({
  page,
}) => {
  await loginDemo(page, 'merchant');
  await page.goto('http://127.0.0.1:6184/orders');
  await page.getByRole('button', { name: 'Accept & Prepare' }).first().click();
  await page.getByRole('button', { name: /Preparing \(/ }).click();
  await page.getByRole('button', { name: 'Mark Ready for Pickup' }).first().click();
  await page.goto('http://127.0.0.1:6184/menu');
  await page.getByRole('button', { name: 'Edit Price' }).first().click();
  await page.getByRole('spinbutton').fill('310');
  await page.getByRole('button', { name: /Save|Update/ }).click();
  await expect(page.getByText(/310/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Available', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Sold Out', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sold Out', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Demo Sign In · Merchant' })).toBeVisible();
});

test('merchant can add a dish and reset the sample menu', async ({ page }) => {
  await loginDemo(page, 'merchant');
  await page.goto('http://127.0.0.1:6184/menu');
  await page.getByRole('button', { name: 'Add Dish', exact: true }).click();
  await page.getByLabel(/English/).fill('Demo Firfir');
  await page.getByLabel(/Amharic/).fill('ፍርፍር');
  await page.getByRole('spinbutton').fill('150');
  await page
    .getByRole('button', { name: /Add to Menu|Save|Add Dish/ })
    .last()
    .click();
  await expect(page.getByRole('heading', { name: 'Demo Firfir' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await page.goto('http://127.0.0.1:6184/menu');
  await expect(page.getByRole('heading', { name: 'Demo Firfir' })).toHaveCount(0);
});

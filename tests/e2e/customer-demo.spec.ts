import { test, expect, loginDemo } from './demoHelpers';

test('customer can browse, place an order, track it, refresh and sign out', async ({ page }) => {
  await loginDemo(page, 'customer');
  await page.getByRole('heading', { name: /Koye Kitchen|ኮዬ ኪችን/ }).click();
  await page
    .getByRole('button', { name: /^Add .+ to cart$/ })
    .first()
    .click();
  await page.goto('http://127.0.0.1:6183/app/cart');
  await page.getByRole('button', { name: /Checkout|ወደ ክፍያ/ }).click();
  await page.getByLabel('Delivery Address', { exact: true }).fill('Koye Feche, Block 42');
  await page.getByRole('button', { name: 'Place Demo Order' }).click();
  await expect(page).toHaveURL(/\/app\/orders\/demo-order-/);
  await page.getByRole('button', { name: 'Track Order', exact: true }).click();
  await expect(page).toHaveURL(/\/app\/tracking\//);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Track Order' })).toBeVisible();
  for (const label of [
    '✓ Accepted',
    '✓ Preparing your food',
    '✓ Ready for pickup',
    '✓ On the way',
    '✓ Delivered',
  ]) {
    await page.getByRole('button', { name: 'Simulate next step' }).click();
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByText('✓ Delivered', { exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:6183/app/profile');
  await page.getByRole('button', { name: 'Log Out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Demo Sign In · Customer' })).toBeVisible();
});

test('customer can change areas and save addresses and notification preferences', async ({
  page,
}) => {
  await loginDemo(page, 'customer');
  await page.getByRole('button', { name: /Change|ቀይር/, exact: true }).click();
  await expect(page).toHaveURL(/\/location/);
  await page
    .getByText('Tulu Dimtu', { exact: true })
    .or(page.getByText('ቱሉ ዲምቱ', { exact: true }))
    .click();
  await expect(page.getByRole('heading', { name: /Tulu Cafe|ቱሉ ካፌ/ })).toBeVisible();
  await page.goto('http://127.0.0.1:6183/app/profile');
  await page.getByRole('button', { name: 'Add Address' }).click();
  await page.getByLabel('Full Address', { exact: true }).fill('Demo office');
  await page.getByLabel('Label', { exact: true }).fill('work');
  await page.getByRole('button', { name: 'Save Address', exact: true }).click();
  await expect(page.getByText('Demo office', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Notification Preferences' }).click();
  await page.getByRole('checkbox', { name: 'Offers & promotions' }).check();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Offers & promotions' })).toBeChecked();
});

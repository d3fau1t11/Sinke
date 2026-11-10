import { test, expect, loginDemo } from './demoHelpers';

const apps = [
  { role: 'customer', port: 6183, route: '/app/orders', title: 'የእርስዎ ትዕዛዞች' },
  { role: 'merchant', port: 6184, route: '/menu', title: 'ሜኑ እና አቅርቦት' },
  { role: 'rider', port: 6185, route: '/history', title: 'የማድረስ ታሪክ' },
  { role: 'admin', port: 6186, route: '/users', title: 'የተጠቃሚ አስተዳደር' },
] as const;

for (const app of apps) {
  test(`${app.role} supports Amharic on pages and remembers it after restart`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, app.role);
    await page.getByLabel('ቋንቋ / Language').selectOption('am');
    await page.goto(`http://127.0.0.1:${app.port}${app.route}`);
    await expect(page.getByRole('heading', { name: app.title, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
    await expect(page.locator('html')).toHaveAttribute('lang', 'am');
    await page.reload();
    await expect(page.getByLabel('ቋንቋ / Language')).toHaveValue('am');
    await expect(page.getByRole('heading', { name: app.title, exact: true })).toBeVisible();
    await page.screenshot({ path: `scratch/qa/${app.role}-amharic.png`, fullPage: true });
    await page.getByLabel('ቋንቋ / Language').selectOption('en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
}

test('checkout bundles the official wallet brands and keeps live availability explicit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginDemo(page, 'customer');
  await page.getByRole('heading', { name: /Koye Kitchen|ኮዬ ኪችን/ }).click();
  await page
    .getByRole('button', { name: /^Add .+ to cart$/ })
    .first()
    .click();
  await page.goto('http://127.0.0.1:6183/app/checkout');
  await expect(page.getByRole('img', { name: 'telebirr', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'CBE Birr', exact: true })).toBeVisible();
  await page.getByLabel('ቋንቋ / Language').selectOption('am');
  await expect(page.getByText('የክፍያ ዘዴ', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'scratch/qa/checkout-amharic.png', fullPage: true });
});

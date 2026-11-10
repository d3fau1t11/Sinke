import { test, expect, loginDemo } from './demoHelpers';

test('merchant photos, menu deletion and demo withdrawal work and persist', async ({ page }) => {
  await loginDemo(page, 'merchant');
  await page.goto('http://127.0.0.1:6184/menu');
  await page.getByRole('button', { name: 'Edit Price' }).first().click();
  await page.locator('input[type="file"]').setInputFiles({
    name: 'dish.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a/dsAAAAASUVORK5CYII=',
      'base64',
    ),
  });
  await expect(page.getByRole('img', { name: 'Food dish' })).toHaveAttribute(
    'src',
    /^data:image\/jpeg/,
  );
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.reload();
  await expect(page.getByRole('img', { name: 'Doro Wot', exact: true })).toHaveAttribute(
    'src',
    /^data:image\/jpeg/,
  );
  page.once('dialog', (dialog) => {
    void dialog.accept();
  });
  await page.getByRole('button', { name: 'Remove Doro Wot', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Edit Price' })).toHaveCount(3);
  await page.goto('http://127.0.0.1:6184/finances');
  await page.getByRole('button', { name: 'Request Withdrawal' }).click();
  await page.getByLabel('Amount (ETB)', { exact: true }).fill('50');
  await page.getByLabel('Demo Account Number', { exact: true }).fill('1000000000');
  await page.getByLabel('Demo Account Name', { exact: true }).fill('Demo Kitchen');
  await page.getByRole('button', { name: 'Record Demo Withdrawal' }).click();
  await expect(page.getByRole('heading', { name: 'Demo withdrawal recorded' })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.reload();
  await expect(page.getByText('pending', { exact: true })).toBeVisible();
});

test('admin transaction filters show matching results and an empty state', async ({ page }) => {
  await loginDemo(page, 'admin');
  await page.goto('http://127.0.0.1:6186/transactions');
  await page.getByLabel('Payment status', { exact: true }).selectOption('completed');
  await expect(page.locator('tbody tr')).toHaveCount(2);
  await page.getByLabel('Search transactions', { exact: true }).fill('DEMO-1004');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('DEMO-1004');
  await page.getByLabel('Search transactions', { exact: true }).fill('no-such-order');
  await expect(page.getByText('No transactions match current filters.')).toBeVisible();
});

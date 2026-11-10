import { test, expect, loginDemo } from './demoHelpers';

test('rider can go offline, accept and complete a job, and see earnings and history', async ({
  page,
}) => {
  await loginDemo(page, 'rider');
  await page.getByRole('button', { name: /Online/ }).click();
  await expect(page.getByRole('button', { name: 'Accept Job' }).first()).toBeDisabled();
  await page.getByRole('button', { name: /Offline/ }).click();
  await page.getByRole('button', { name: 'Accept Job' }).first().click();
  await expect(page).toHaveURL(/\/active/);
  await page.reload();
  await page.getByRole('button', { name: 'Mark as Picked Up' }).click();
  await page.getByRole('button', { name: 'Mark as Delivered' }).click();
  await expect(page.getByRole('heading', { name: 'Delivered!' })).toBeVisible();
  await page.getByRole('button', { name: 'View Earnings' }).click();
  await expect(page.getByText(/120/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Request Withdrawal' }).click();
  await page.getByLabel('Amount (ETB)', { exact: true }).fill('50');
  await page.getByLabel('Demo Account Number', { exact: true }).fill('1000000000');
  await page.getByLabel('Demo Account Name', { exact: true }).fill('Abebe Demo');
  await page.getByRole('button', { name: 'Record Demo Withdrawal' }).click();
  await expect(page.getByRole('heading', { name: 'Demo withdrawal recorded' })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByText('pending', { exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:6185/history');
  await expect(page.getByRole('heading', { name: 'Delivery History' })).toBeVisible();
  await page.getByRole('button', { name: /Log out/i }).click();
  await expect(page.getByRole('button', { name: 'Demo Sign In · Rider' })).toBeVisible();
});

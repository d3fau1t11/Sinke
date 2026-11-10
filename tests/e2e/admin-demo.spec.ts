import { test, expect, loginDemo } from './demoHelpers';

test('admin can browse users, filter orders, toggle merchant status and view zones and transactions', async ({
  page,
}) => {
  await loginDemo(page, 'admin');
  await page.goto('http://127.0.0.1:6186/users');
  await expect(page.getByText('Selam Demo', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /rider \(/ }).click();
  await expect(page.getByText('Abebe Demo Rider', { exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:6186/orders');
  await expect(page.getByText(/DEMO-1000/)).toBeVisible();
  await page.getByRole('button', { name: 'delivered', exact: true }).click();
  await expect(page.getByText(/DEMO-1004/)).toBeVisible();
  await page.goto('http://127.0.0.1:6186/merchants');
  await page.getByRole('button', { name: 'OPEN', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'CLOSED', exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:6186/zones');
  await expect(page.getByRole('heading', { name: 'Koye Feche' })).toBeVisible();
  await page.goto('http://127.0.0.1:6186/transactions');
  await expect(page.getByText(/DEMO-1000/).first()).toBeVisible();
  await page.getByRole('button', { name: /Log out|Sign Out/i }).click();
  await expect(page.getByRole('button', { name: 'Demo Sign In · Admin' })).toBeVisible();
});

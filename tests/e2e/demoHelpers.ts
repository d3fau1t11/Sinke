import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export const test = base.extend<{ demoSafety: void }>({
  demoSafety: [
    async ({ page }, use) => {
      const errors: string[] = [];
      const backendCalls: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (request.url().includes('.supabase.co/')) backendCalls.push(request.url());
      });
      await page.route('**/*.supabase.co/**', (route) => route.abort());
      await use();
      expect(errors).toEqual([]);
      expect(backendCalls).toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };

const ports = { customer: 6183, merchant: 6184, rider: 6185, admin: 6186 };

export async function loginDemo(page: Page, role: keyof typeof ports) {
  await page.goto(
    `http://127.0.0.1:${ports[role]}/${role === 'customer' ? 'auth/phone' : 'login'}`,
  );
  await page
    .getByRole('button', { name: `Demo Sign In · ${role.charAt(0).toUpperCase()}${role.slice(1)}` })
    .click();
  await expect(page.getByLabel('Demo mode')).toBeVisible();
}

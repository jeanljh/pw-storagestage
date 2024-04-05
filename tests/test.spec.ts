import { test } from '../fixtures/base'

test('sign in with storage state file if present', async ({ page }) => {
  await page.locator('.app-font-title-bold', { hasText: /Welcome to Teams!/ }).waitFor()
});

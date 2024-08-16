import { test } from '../fixtures/base'

test('sign in with storage state file if present', async ({ page }) => {
  await page.locator('[data-tid="chat-list-header"]').waitFor()
});

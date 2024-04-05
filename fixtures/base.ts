import { test as baseTest, Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import credentials from './config'
import Login from '../pages/login.page'

export * from '@playwright/test'
export const test = baseTest.extend<{
    page: Page
    login: Login
}>({
    page: async ({ browser }, use) => {
        // check if user session is present
		const sessionFilePath = path.join('session', 'storageStage.json');
        const existSessionFile = fs.existsSync(sessionFilePath)

        // check if the session file is present and load the storage state, else create a new context
        const context = existSessionFile ? await browser.newContext({ storageState: sessionFilePath }) : await browser.newContext()
        const page = await context.newPage()
        await page.goto('')

        // if session file does not exist, proceed to sign in via UI
        if (!existSessionFile) {
            const login = new Login(page)
            await login.signIn(credentials.user, credentials.password)
        }
		
        // returns storage state for current browser context
        await context.storageState({ path: sessionFilePath });
        await use(page)
    },
})

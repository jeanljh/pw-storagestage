import { expect, Locator, Page } from "@playwright/test";

export default class Login {
    readonly inputUsername: Locator
    readonly inputPassword: Locator
    readonly buttonSubmit: Locator
    readonly buttonUsePassword: Locator

    constructor(readonly page: Page) {
        this.inputUsername = this.page.locator('input[name=loginfmt]')
		this.inputPassword = this.page.getByPlaceholder('Password')
		this.buttonSubmit = this.page.locator('#idSIButton9').or(page.locator('#acceptButton'))
		this.buttonUsePassword = this.page.getByRole('button', { name: /Use your password/ })
    }

	async signIn(username: string, password: string): Promise<void> {
        await this.inputUsername.fill(username)
        await this.buttonSubmit.click()

        // Microsoft defaults this account to an emailed one-time code, so the
        // password field is not rendered until the password path is chosen.
        // Wait for whichever of the two appears, then opt into the password.
        await expect(this.inputPassword.or(this.buttonUsePassword).first()).toBeVisible()
        if (await this.buttonUsePassword.isVisible()) {
            await this.buttonUsePassword.click()
        }

        await this.inputPassword.fill(password)
        await this.buttonSubmit.click()
        await this.buttonSubmit.click()
	}
}
import { Locator, Page } from "@playwright/test";

export default class Login {
    readonly inputUsername: Locator
    readonly inputPassword: Locator
    readonly buttonSubmit: Locator

    constructor(readonly page: Page) {
        this.inputUsername = this.page.locator('input[name=loginfmt]')
		this.inputPassword = this.page.getByPlaceholder('Password')
		this.buttonSubmit = this.page.locator('#idSIButton9').or(page.locator('#acceptButton'))
    }

	async signIn(username: string, password: string): Promise<void> {
        await this.inputUsername.fill(username)
        await this.buttonSubmit.click()
        await this.inputPassword.fill(password)
        await this.buttonSubmit.click()
        await this.buttonSubmit.click()
	}
}
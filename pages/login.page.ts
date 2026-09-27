import { expect, Locator, Page } from "@playwright/test";

export default class Login {
    readonly inputUsername: Locator
    readonly inputPassword: Locator
    readonly buttonSubmit: Locator
    readonly buttonUsePassword: Locator
    readonly buttonSecurityInfoOk: Locator

    constructor(readonly page: Page) {
        this.inputUsername = this.page.locator('input[name=loginfmt]')
		// the redesigned sign-in labels this field rather than using a placeholder
		this.inputPassword = this.page.getByRole('textbox', { name: 'Password' })
		this.buttonSubmit = this.page.locator('#idSIButton9')
			.or(page.locator('#acceptButton'))
			.or(page.getByRole('button', { name: /^(Next|Sign in|Yes)$/ }))
		this.buttonUsePassword = this.page.getByRole('button', { name: /Use your password/ })
		this.buttonSecurityInfoOk = this.page.getByRole('button', { name: 'Looks good!' })
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

        // After the password, Microsoft may show "Stay signed in?", a prompt to
        // reconfirm the account's security info, both, or neither, before it
        // redirects. Clear whichever appears so the redirect can complete.
        for (let i = 0; i < 3; i++) {
            if (await this.buttonSecurityInfoOk.isVisible().catch(() => false)) {
                await this.buttonSecurityInfoOk.click()
            } else if (await this.buttonSubmit.first().isVisible().catch(() => false)) {
                await this.buttonSubmit.first().click()
            } else {
                break
            }
            await this.page.waitForLoadState('domcontentloaded').catch(() => {})
        }
	}
}
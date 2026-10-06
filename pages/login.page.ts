import { expect, Locator, Page } from "@playwright/test";

export default class Login {
    readonly inputUsername: Locator
    readonly inputPassword: Locator
    readonly buttonSubmit: Locator
    readonly buttonUsePassword: Locator
    readonly buttonSecurityInfoOk: Locator
    readonly buttonStaySignedIn: Locator

    constructor(readonly page: Page) {
        this.inputUsername = this.page.locator('input[name=loginfmt]')
		// the redesigned sign-in labels this field rather than using a placeholder
		this.inputPassword = this.page.getByRole('textbox', { name: 'Password' })
		this.buttonSubmit = this.page.locator('#idSIButton9')
			.or(page.locator('#acceptButton'))
			.or(page.getByRole('button', { name: /^(Next|Sign in|Yes)$/ }))
		this.buttonUsePassword = this.page.getByRole('button', { name: /Use your password/ })
		this.buttonSecurityInfoOk = this.page.getByRole('button', { name: 'Looks good!' })
		this.buttonStaySignedIn = this.page.getByRole('button', { name: /^(Yes|Next|Sign in)$/ })
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
        await this.buttonSubmit.first().click()

        // Microsoft interrupts the redirect with "Is your security info still
        // accurate?" and/or "Stay signed in?". They render after a navigation,
        // so wait for one to appear rather than checking immediately.
        for (let i = 0; i < 3; i++) {
            const prompt = this.buttonSecurityInfoOk.or(this.buttonStaySignedIn).first()
            try {
                await prompt.waitFor({ state: 'visible', timeout: 15000 })
            } catch {
                break
            }
            await prompt.click()
        }
	}
}
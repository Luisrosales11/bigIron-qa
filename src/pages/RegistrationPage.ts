import { Page, expect } from '@playwright/test'; // Import Playwright Page and expect

export class RegistrationPage {
  constructor(private page: Page) {} // Store Playwright page instance

  async openSignInModal() {
    await this.page.click('a.nav-signin'); // Click sign-in link
  }

  async openRegisterModal() {
    await this.page.click('#btnShowRegisterModal'); // Click register button
  }

  async enterEmail(email: string) {
    await this.page.fill('#EmailInput', email); // Fill email input
    await expect(this.page.locator('#btnContinue')).toBeEnabled(); // Assert Continue button enabled
    await this.page.click('#btnContinue'); // Click Continue
  }

  async enterVerificationCode(code: string) {
    const digits = code.split(''); // Split code into digits
    for (let i = 0; i < digits.length; i++) {
      await this.page.locator('.verification-inputs .code-input').nth(i).fill(digits[i] ?? ''); // Fill each digit
    }
    await expect(this.page.locator('#verify-btn')).toBeEnabled(); // Assert verify button enabled
    await this.page.click('#verify-btn'); // Click verify
  }

  async fillUserInfo({
    firstName,
    lastName,
    password,
    address1,
    address2 = '',
    city,
    state,
    zipCode
  }: {
    firstName: string;
    lastName: string;
    password: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
  }) {
    await this.page.fill('#FirstName', firstName); // Fill first name
    await this.page.fill('#LastName', lastName); // Fill last name
    await this.page.fill('#PasswordField', password); // Fill password
    await this.page.fill('#Address1', address1); // Fill address1
    if (address2) await this.page.fill('#Address2', address2); // Optionally fill address2
    await this.page.fill('#City', city); // Fill city
    await this.page.selectOption('#State', state); // Select state
    await this.page.fill('#ZipCode', zipCode); // Fill zip code
    // Phone is disabled, so we skip it
    await expect(this.page.locator('#btnCreateAccount')).toBeEnabled(); // Assert Create Account enabled
    await this.page.click('#btnCreateAccount'); // Click Create Account
  }

  async assertAccountCreated() {
    await expect(this.page.locator('text=Account created successfully!')).toBeVisible(); // Assert success message
    await this.page.click('button.start-bidding-button'); // Click start bidding
    await expect(this.page.locator('a.yellow-header-menu', { hasText: 'Sign Out' })).toBeVisible(); // Assert sign out visible
  }

  async selectAddressSuggestion(partialAddress: string, suggestionText: string) {
    await this.page.fill('#Address1', partialAddress); // Fill partial address
    // Wait for the suggestion list to appear
    await this.page.waitForSelector('.pac-item', { state: 'visible' }); // Wait for address suggestions
    // Click the suggestion that matches the text
    await this.page.locator('.pac-item', { hasText: suggestionText }).first().click(); // Select suggestion
  }

  async getAutofilledAddressFields() {
    const city = await this.page.inputValue('#City'); // Get autofilled city
    const state = await this.page.inputValue('#State'); // Get autofilled state
    const zipCode = await this.page.inputValue('#ZipCode'); // Get autofilled zip
    return { city, state, zipCode };
  }
}

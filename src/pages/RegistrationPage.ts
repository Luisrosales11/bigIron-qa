import { Page, expect } from '@playwright/test';

export class RegistrationPage {
  constructor(private page: Page) {}

  async openSignInModal() {
    await this.page.click('a.nav-signin');
  }

  async openRegisterModal() {
    await this.page.click('#btnShowRegisterModal');
  }

  async enterEmail(email: string) {
    await this.page.fill('#EmailInput', email);
    await expect(this.page.locator('#btnContinue')).toBeEnabled();
    await this.page.click('#btnContinue');
  }

  async enterVerificationCode(code: string) {
    const digits = code.split('');
    for (let i = 0; i < digits.length; i++) {
      await this.page.locator('.verification-inputs .code-input').nth(i).fill(digits[i] ?? '');
    }
    await expect(this.page.locator('#verify-btn')).toBeEnabled();
    await this.page.click('#verify-btn');
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
    await this.page.fill('#FirstName', firstName);
    await this.page.fill('#LastName', lastName);
    await this.page.fill('#PasswordField', password);
    await this.page.fill('#Address1', address1);
    if (address2) await this.page.fill('#Address2', address2);
    await this.page.fill('#City', city);
    await this.page.selectOption('#State', state);
    await this.page.fill('#ZipCode', zipCode);
    // Phone is disabled, so we skip it
    await expect(this.page.locator('#btnCreateAccount')).toBeEnabled();
    await this.page.click('#btnCreateAccount');
  }

  async assertAccountCreated() {
    await expect(this.page.locator('text=Account created successfully!')).toBeVisible();
    await this.page.click('button.start-bidding-button');
    await expect(this.page.locator('a.yellow-header-menu', { hasText: 'Sign Out' })).toBeVisible();
  }

  async selectAddressSuggestion(partialAddress: string, suggestionText: string) {
    await this.page.fill('#Address1', partialAddress);
    // Wait for the suggestion list to appear
    await this.page.waitForSelector('.pac-item', { state: 'visible' });
    // Click the suggestion that matches the text
    await this.page.locator('.pac-item', { hasText: suggestionText }).first().click();
  }

  async getAutofilledAddressFields() {
    const city = await this.page.inputValue('#City');
    const state = await this.page.inputValue('#State');
    const zipCode = await this.page.inputValue('#ZipCode');
    return { city, state, zipCode };
  }
}

import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../src/pages/RegistrationPage';

test.describe('Negative Registration Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.bigiron.com/');
    const registration = new RegistrationPage(page);
    await registration.openSignInModal();
    await registration.openRegisterModal();
  });

  test('Invalid email format disables Continue button', async ({ page }) => {
    const registration = new RegistrationPage(page);
    await registration.enterEmail('invalid-email');
    await expect(page.locator('#btnContinue')).toBeDisabled();
  });

  test('Create account button disabled with missing required fields', async ({ page }) => {
    const registration = new RegistrationPage(page);
    // Simulate after code verification, go to user info modal
    await page.evaluate(() => {
      document.body.innerHTML += '<input id="FirstName"><input id="LastName"><input id="PasswordField"><input id="Address1"><input id="City"><select id="State"></select><input id="ZipCode"><button id="btnCreateAccount"></button>';
    });
    await registration.fillUserInfo({
      firstName: '',
      lastName: '',
      password: '',
      address1: '',
      city: '',
      state: '',
      zipCode: '',
    });
    await expect(page.locator('#btnCreateAccount')).toBeDisabled();
  });

  test('Weak password disables Create account button', async ({ page }) => {
    const registration = new RegistrationPage(page);
    await page.evaluate(() => {
      document.body.innerHTML += '<input id="FirstName"><input id="LastName"><input id="PasswordField"><input id="Address1"><input id="City"><select id="State"></select><input id="ZipCode"><button id="btnCreateAccount"></button>';
    });
    await registration.fillUserInfo({
      firstName: 'Test',
      lastName: 'User',
      password: 'abc', // Weak password
      address1: 'Main St',
      city: 'Omaha',
      state: 'NE',
      zipCode: '68102',
    });
    await expect(page.locator('#btnCreateAccount')).toBeDisabled();
  });

  test('Invalid zip code disables Create account button', async ({ page }) => {
    const registration = new RegistrationPage(page);
    await page.evaluate(() => {
      document.body.innerHTML += '<input id="FirstName"><input id="LastName"><input id="PasswordField"><input id="Address1"><input id="City"><select id="State"></select><input id="ZipCode"><button id="btnCreateAccount"></button>';
    });
    await registration.fillUserInfo({
      firstName: 'Test',
      lastName: 'User',
      password: 'TestPassword1!',
      address1: 'Main St',
      city: 'Omaha',
      state: 'NE',
      zipCode: '123', // Invalid zip
    });
    await expect(page.locator('#btnCreateAccount')).toBeDisabled();
  });

  test('State not selected disables Create account button', async ({ page }) => {
    const registration = new RegistrationPage(page);
    await page.evaluate(() => {
      document.body.innerHTML += '<input id="FirstName"><input id="LastName"><input id="PasswordField"><input id="Address1"><input id="City"><select id="State"></select><input id="ZipCode"><button id="btnCreateAccount"></button>';
    });
    await registration.fillUserInfo({
      firstName: 'Test',
      lastName: 'User',
      password: 'TestPassword1!',
      address1: 'Main St',
      city: 'Omaha',
      state: '', // Not selected
      zipCode: '68102',
    });
    await expect(page.locator('#btnCreateAccount')).toBeDisabled();
  });
});

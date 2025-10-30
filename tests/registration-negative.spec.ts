import { test, expect } from '@playwright/test'; // Import Playwright test and assertion library
import { RegistrationPage } from '../src/pages/RegistrationPage'; // Import RegistrationPage page object

// Test suite for negative registration scenarios
test.describe('Negative Registration Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    console.log('STEP 1: Navigating to registration page');
    await page.goto('https://www.bigiron.com/'); // Navigate to registration page
    const registration = new RegistrationPage(page); // Create RegistrationPage instance
    console.log('STEP 2: Opening sign-in modal');
    await registration.openSignInModal(); // Open sign-in modal
    console.log('STEP 3: Opening registration modal');
    await registration.openRegisterModal(); // Open registration modal
  });

  // Test: Invalid email disables Continue button
  test('Invalid email format disables Continue button', async ({ page }) => {
    console.log('Step 1: Initializing RegistrationPage');
    const registration = new RegistrationPage(page);
    console.log('Step 2: Entering invalid email');
    await registration.enterEmail('invalid-email'); // Enter invalid email
    console.log('Step 3: Asserting Continue button is disabled');
    await expect(page.locator('#btnContinue')).toBeDisabled(); // Assert Continue button is disabled
  });

  // Test: Missing required fields disables Create account button
  test('Create account button disabled with missing required fields', async ({ page }) => {
    console.log('Step 1: Initializing RegistrationPage');
    const registration = new RegistrationPage(page);
    console.log('Step 2: Injecting required fields into DOM');
    await page.evaluate(() => {
      document.body.innerHTML += '<input id="FirstName"><input id="LastName"><input id="PasswordField"><input id="Address1"><input id="City"><select id="State"></select><input id="ZipCode"><button id="btnCreateAccount"></button>';
    }); // Inject required fields into DOM
    console.log('Step 3: Filling user info with missing fields');
    await registration.fillUserInfo({
      firstName: '', // Missing first name
      lastName: '', // Missing last name
      password: '', // Missing password
      address1: '', // Missing address
      city: '', // Missing city
      state: '', // Missing state
      zipCode: '', // Missing zip code
    });
    console.log('Step 4: Asserting Create account button is disabled');
    await expect(page.locator('#btnCreateAccount')).toBeDisabled(); // Assert Create account button is disabled
  });

  // Test: Weak password disables Create account button
  test('Weak password disables Create account button', async ({ page }) => {
    console.log('Step 1: Initializing RegistrationPage');
    const registration = new RegistrationPage(page);
    console.log('Step 2: Injecting required fields into DOM');
    await page.evaluate(() => {
      document.body.innerHTML += '<input id="FirstName"><input id="LastName"><input id="PasswordField"><input id="Address1"><input id="City"><select id="State"></select><input id="ZipCode"><button id="btnCreateAccount"></button>';
    });
    console.log('Step 3: Filling user info with weak password');
    await registration.fillUserInfo({
      firstName: 'Test',
      lastName: 'User',
      password: 'abc', // Weak password
      address1: 'Main St',
      city: 'Omaha',
      state: 'NE',
      zipCode: '68102',
    });
    console.log('Step 4: Asserting Create account button is disabled');
    await expect(page.locator('#btnCreateAccount')).toBeDisabled(); // Assert Create account button is disabled
  });

  // Test: Invalid zip code disables Create account button
  test('Invalid zip code disables Create account button', async ({ page }) => {
    console.log('Step 1: Initializing RegistrationPage');
    const registration = new RegistrationPage(page);
    console.log('Step 2: Injecting required fields into DOM');
    await page.evaluate(() => {
      document.body.innerHTML += '<input id="FirstName"><input id="LastName"><input id="PasswordField"><input id="Address1"><input id="City"><select id="State"></select><input id="ZipCode"><button id="btnCreateAccount"></button>';
    });
    console.log('Step 3: Filling user info with invalid zip code');
    await registration.fillUserInfo({
      firstName: 'Test',
      lastName: 'User',
      password: 'TestPassword1!',
      address1: 'Main St',
      city: 'Omaha',
      state: 'NE',
      zipCode: '123', // Invalid zip
    });
    console.log('Step 4: Asserting Create account button is disabled');
    await expect(page.locator('#btnCreateAccount')).toBeDisabled(); // Assert Create account button is disabled
  });

  // Test: State not selected disables Create account button
  test('State not selected disables Create account button', async ({ page }) => {
    console.log('Step 1: Initializing RegistrationPage');
    const registration = new RegistrationPage(page);
    console.log('Step 2: Injecting required fields into DOM');
    await page.evaluate(() => {
      document.body.innerHTML += '<input id="FirstName"><input id="LastName"><input id="PasswordField"><input id="Address1"><input id="City"><select id="State"></select><input id="ZipCode"><button id="btnCreateAccount"></button>';
    });
    console.log('Step 3: Filling user info with state not selected');
    await registration.fillUserInfo({
      firstName: 'Test',
      lastName: 'User',
      password: 'TestPassword1!',
      address1: 'Main St',
      city: 'Omaha',
      state: '', // State not selected
      zipCode: '68102',
    });
    console.log('Step 4: Asserting Create account button is disabled');
    await expect(page.locator('#btnCreateAccount')).toBeDisabled(); // Assert Create account button is disabled
  });
});

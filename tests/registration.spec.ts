import { test, expect } from '@playwright/test'; // Import Playwright test and assertion library
import { RegistrationPage } from '../src/pages/RegistrationPage'; // Import RegistrationPage page object
import axios from 'axios'; // Import axios for HTTP requests

// Helper to get a temp email and fetch code from mail.tm
async function getTempEmailAndCode() {
  // 1. Create account on mail.tm
  const domainRes = await axios.get('https://api.mail.tm/domains'); // Get available email domains
  const domain = domainRes.data['hydra:member'][0].domain;
  const username = `bigironqa${Date.now()}@${domain}`; // Generate unique email
  const password = 'TestPassword123!';
  await axios.post('https://api.mail.tm/accounts', { address: username, password }); // Create account
  // 2. Auth
  const tokenRes = await axios.post('https://api.mail.tm/token', { address: username, password }); // Get auth token
  const token = tokenRes.data.token;
  // 3. Wait for email with verification code
  let code = '';
  for (let i = 0; i < 10; i++) {
    const messages = await axios.get('https://api.mail.tm/messages', { headers: { Authorization: `Bearer ${token}` } }); // Fetch messages
    if (messages.data['hydra:member'].length > 0) {
      const msg = messages.data['hydra:member'][0];
      const body = msg.text || msg.html || '';
      code = (body.match(/\b\d{6}\b/) || [''])[0]; // Extract 6-digit code
      if (code) break;
    }
    await new Promise(r => setTimeout(r, 3000)); // Wait before retry
  }
  return { email: username, code };
}

// Test: User can register with email and verification code
test('User can register with email and verification code', async ({ page }) => {
  const registration = new RegistrationPage(page); // Create RegistrationPage instance
  console.log('STEP 1: Navigating to registration page');
  await page.goto('https://www.bigiron.com/'); // Go to registration page

  console.log('STEP 2: Opening sign-in modal');
  await registration.openSignInModal(); // Open sign-in modal

  console.log('STEP 3: Opening registration modal');
  await registration.openRegisterModal(); // Open registration modal

  console.log('STEP 4: Getting temp email and verification code');
  const { email, code } = await getTempEmailAndCode(); // Get temp email and code

  console.log(`STEP 5: Entering email: ${email}`);
  await registration.enterEmail(email); // Enter email

  console.log(`STEP 6: Entering verification code: ${code}`);
  expect(code).not.toBe(''); // Ensure code is received
  await registration.enterVerificationCode(code); // Enter verification code

  console.log('STEP 7: Selecting address suggestion');
  await registration.selectAddressSuggestion('M', 'Main Street'); // Use address autocomplete

  console.log('STEP 8: Getting autofilled address fields');
  const autofilled = await registration.getAutofilledAddressFields(); // Get autofilled city/state/zip
  expect(autofilled.city).not.toBe(''); // Assert city is filled
  expect(autofilled.state).not.toBe(''); // Assert state is filled
  expect(autofilled.zipCode).not.toBe(''); // Assert zip is filled

  console.log('STEP 9: Filling user info');
  await registration.fillUserInfo({
    firstName: 'Test', // Fill first name
    lastName: 'User', // Fill last name
    password: 'TestPassword1!', // Fill password
    address1: 'Main Street', // Should match the suggestion
    city: autofilled.city, // Use autofilled city
    state: autofilled.state, // Use autofilled state
    zipCode: autofilled.zipCode, // Use autofilled zip
  });

  console.log('STEP 10: Asserting account creation');
  await registration.assertAccountCreated(); // Assert account creation
});

import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import axios from 'axios';

// Helper to get a temp email and fetch code from mail.tm
async function getTempEmailAndCode() {
  // 1. Create account
  const domainRes = await axios.get('https://api.mail.tm/domains');
  const domain = domainRes.data['hydra:member'][0].domain;
  const username = `bigironqa${Date.now()}@${domain}`;
  const password = 'TestPassword123!';
  await axios.post('https://api.mail.tm/accounts', { address: username, password });
  // 2. Auth
  const tokenRes = await axios.post('https://api.mail.tm/token', { address: username, password });
  const token = tokenRes.data.token;
  // 3. Wait for email
  let code = '';
  for (let i = 0; i < 10; i++) {
    const messages = await axios.get('https://api.mail.tm/messages', { headers: { Authorization: `Bearer ${token}` } });
    if (messages.data['hydra:member'].length > 0) {
      const msg = messages.data['hydra:member'][0];
      const body = msg.text || msg.html || '';
      code = (body.match(/\b\d{6}\b/) || [''])[0];
      if (code) break;
    }
    await new Promise(r => setTimeout(r, 3000));
  }
  return { email: username, code };
}

test('User can register with email and verification code', async ({ page }) => {
  const registration = new RegistrationPage(page);
  await page.goto('https://www.bigiron.com/');
  await registration.openSignInModal();
  await registration.openRegisterModal();

  const { email, code } = await getTempEmailAndCode();
  await registration.enterEmail(email);
  expect(code).not.toBe('');
  await registration.enterVerificationCode(code);

  // Fill user info after verification, using autocomplete for address
  await registration.selectAddressSuggestion('M', 'Main Street');
  const autofilled = await registration.getAutofilledAddressFields();
  expect(autofilled.city).not.toBe('');
  expect(autofilled.state).not.toBe('');
  expect(autofilled.zipCode).not.toBe('');

  await registration.fillUserInfo({
    firstName: 'Test',
    lastName: 'User',
    password: 'TestPassword1!',
    address1: 'Main Street', // Should match the suggestion
    city: autofilled.city,
    state: autofilled.state,
    zipCode: autofilled.zipCode,
  });
  await registration.assertAccountCreated();
  // Add more assertions as needed for successful registration
});

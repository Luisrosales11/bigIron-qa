# BigIron QA Automation

This repository contains Playwright end-to-end tests for the registration flow on https://www.bigiron.com/ using the Page Object Model (POM) pattern and TypeScript.

## Features
- Automated registration test with email verification using a temporary email service (mail.tm)
- Page Object Model structure for maintainable and scalable tests
- Address autocomplete and autofill field handling
- Headed mode enabled for visual debugging

## Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher)
- Internet access (for Playwright browsers and mail.tm API)

## Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Luisrosales11/bigIron-qa
   cd bigIron-qa
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Install Playwright browsers:**
   ```sh
   npx playwright install
   ```

## Running Tests
- To run all tests in headed mode (browser UI visible):
  ```sh
  npx playwright test
  ```
- To run a specific test:
  ```sh
  npx playwright test tests/registration.spec.ts
  ```

## Project Structure
```
├── src/pages/                # Page Object Model classes
│   └── RegistrationPage.ts   # Registration page object
├── tests/                    # Test files
│   ├── registration.spec.ts  # Registration flow test
│   └── registration-negative.spec.ts # Negative and edge case tests
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project metadata and scripts
```

## Registration Test Flow
1. Go to the main page.
2. Open the Sign In modal, then the Register Now modal.
3. Use a temporary email (mail.tm) to receive a verification code.
4. Enter the code in the modal.
5. Use the address autocomplete, select a suggestion, and verify autofilled fields.
6. Fill in the rest of the registration form and submit.
7. Confirm account creation and sign-in.

## Negative & Edge Case Test Scenarios
- **Invalid email format disables Continue button**
- **Create account button disabled with missing required fields**
- **Weak password disables Create account button**
- **Invalid zip code disables Create account button**
- **State not selected disables Create account button**

These scenarios are automated in `tests/registration-negative.spec.ts`.

## Cloudflare Challenge
**Note:** The site uses Cloudflare protection. If you see a "Verifying you are human" screen, you must manually complete the challenge in headed mode. Automated bypass is not supported.

## Troubleshooting
- If tests fail due to Cloudflare, try running in headed mode and manually solve the challenge.
- Ensure your network allows access to mail.tm and Playwright browser downloads.

## Contributing
- Use the Page Object Model for new flows.
- Add new tests in the `tests/` directory.
- Keep dependencies up to date.

## License
MIT

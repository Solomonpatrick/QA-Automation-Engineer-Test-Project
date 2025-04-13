import { expect } from '@playwright/test';
import { TIMEOUTS, SELECTORS } from '../config/constants';
import { environment } from '../config/environment';

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator(SELECTORS.LOGIN_EMAIL);
    this.passwordInput = page.locator(SELECTORS.LOGIN_PASSWORD);
    this.signInButton = page.locator(SELECTORS.SIGN_IN_BUTTON);
    this.errorMessage = page.locator('.MuiTypography-root.MuiTypography-body1.mui-hv915t');
  }

  async navigate() {
    await this.page.goto(environment.loginPath);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForSelector(SELECTORS.LOGIN_EMAIL, { state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.page.waitForSelector(SELECTORS.LOGIN_PASSWORD, { state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await this.page.waitForSelector(SELECTORS.SIGN_IN_BUTTON, { state: 'visible', timeout: TIMEOUTS.MEDIUM });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async verifyErrorMessage(expectedText) {
    await expect(this.errorMessage).toBeVisible({ timeout: TIMEOUTS.SHORT });
    await expect(this.errorMessage).toContainText(expectedText);
  }

  async verifyLoginPageLoaded() {
    // Check we're on the login page
    await expect(this.page).toHaveURL(/.*\/next\/signin.*/, { timeout: TIMEOUTS.MEDIUM });
    expect(this.page.url()).toContain('/next/signin');
    
    // Verify login form is visible
    await expect(this.emailInput).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await expect(this.passwordInput).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }
}

export default LoginPage;
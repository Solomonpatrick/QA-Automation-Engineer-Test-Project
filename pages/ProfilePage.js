import { expect } from '@playwright/test';
import { TIMEOUTS, SELECTORS, ROUTES } from '../config/constants';
import { environment } from '../config/environment';

class ProfilePage {
  constructor(page) {
    this.page = page;
    this.profileTitle = page.getByRole('heading', { name: 'Profile' });
    this.signOutButton = page.locator(SELECTORS.SIGN_OUT_BUTTON).first();
    this.confirmSignOutButton = page.locator(SELECTORS.SIGN_OUT_CONFIRM);
  }

  async navigate() {
    const profileUrl = `${environment.baseURL}${ROUTES.PROFILE}`;
    await this.page.goto(profileUrl);
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded() {
    await expect(this.profileTitle).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async clickSignOut() {
    await this.signOutButton.click();
  }

  async confirmSignOut() {
    await expect(this.page.locator('text=Do you really want to sign out?')).toBeVisible();
    await this.confirmSignOutButton.click();
  }
}

export default ProfilePage;
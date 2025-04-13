// tests/login.spec.js
import { test, expect } from '@playwright/test';
import { environment } from '../config/environment';
import { credentials } from '../config/credentials';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';

test.describe('Login Tests', () => {
  const homeURL = `${environment.baseURL}/next/home`;
  const dashboardURL = `${environment.baseURL}/next/dashboards/g/2082/qa-automation-test-project`;
  const { email, password } = credentials.standard;

  test('Happy Path: User can log in successfully and navigate to QA Dashboard', async ({ page }) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    
    // 1. Go to login page and log in
    await loginPage.navigate();
    await loginPage.login(email, password);

    // 2. Verify navigation to home page
    await page.waitForURL(homeURL);
    await expect(page).toHaveURL(homeURL);
    
    // 3. Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // 4. Navigate to the dashboard
    await homePage.navigateToDashboard('QA Automation test Project');
    
    // 5. Verify navigation to dashboard
    await page.waitForURL(dashboardURL);
    await expect(page).toHaveURL(dashboardURL);
  });
});

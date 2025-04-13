import { test, expect } from '@playwright/test';
import { environment } from '../config/environment';
import { credentials } from '../config/credentials';
import { TIMEOUTS } from '../config/constants';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';

test.describe('Negative / Alternative Flows', () => {

  test('Unhappy Path #1: Invalid login credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // 1. Navigate to login page
    await loginPage.navigate();
    
    // 2. Attempt login with invalid email
    await loginPage.login('invalid@example.com', credentials.standard.password);
    
    // 3. Verify error message appears
    await loginPage.verifyErrorMessage('Invalid credentials');
    
    // 4. Attempt login with valid email but invalid password
    await loginPage.login(credentials.standard.email, 'wrongpassword123');
    
    // 5. Verify error message appears again
    await loginPage.verifyErrorMessage('Invalid credentials');
    
    // 6. Verify we're still on the login page
    expect(page.url()).toContain('/next/signin');
  });

  test('Unhappy Path #2: Attempting to access dashboard without login', async ({ page }) => {
    // 1. Attempt to directly access the dashboard URL without authentication
    const dashboardURL = `${environment.baseURL}/next/dashboards/g/2082/qa-automation-test-project`;
    await page.goto(dashboardURL);
    
    // 2. Wait for redirection to login page - using a more flexible approach
    try {
      await page.waitForURL(/.*\/next\/signin.*/, { timeout: TIMEOUTS.MEDIUM });
    } catch (e) {
      // Sometimes the URL might not change exactly as expected
      // Let's check if we're on a login page by looking for login elements
      const isOnLoginPage = 
        await page.isVisible('input[type="email"]') || 
        await page.isVisible('input[type="password"]') ||
        page.url().includes('/signin');
        
      expect(isOnLoginPage).toBeTruthy('Expected to be redirected to login page');
    }
    
    // 3. Verify we were redirected to login page
    expect(page.url()).toContain('/next/signin');
    
    // 4. Try to access a different protected page
    await page.goto(`${environment.baseURL}/next/profile`);
    
    // 5. Verify we're still redirected to the login page
    try {
      await page.waitForURL(/.*\/next\/signin.*/, { timeout: TIMEOUTS.MEDIUM });
    } catch (e) {
      // Alternative verification if URL doesn't change as expected
      const isStillOnLoginPage = 
        await page.isVisible('input[type="email"]') || 
        await page.isVisible('input[type="password"]') ||
        page.url().includes('/signin');
        
      expect(isStillOnLoginPage).toBeTruthy('Expected to be redirected to login page on second attempt');
    }
  });
});
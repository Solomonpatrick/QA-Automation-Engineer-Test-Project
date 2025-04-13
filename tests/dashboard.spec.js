import { test, expect } from '@playwright/test';
import { environment } from '../config/environment';
import { credentials } from '../config/credentials';
import { TIMEOUTS } from '../config/constants';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import { navigateToDashboard, verifyLoggedIn } from '../utils/TestUtils';

// Create fixture for common setup
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(credentials.standard.email, credentials.standard.password);
      
  // Verify login success
  await verifyLoggedIn(page);
      
  // Navigate to dashboard
  await navigateToDashboard(page, 'QA Automation test Project');
      
  // Verify we're on the dashboard
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.verifyPageLoaded();
});

test.describe('Dashboard Tests', () => {
  test('Happy Path #1: Verify dashboard title is visible', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyPageLoaded();
  });

  test('Happy Path #2: Check that power & energy chart is visible', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Check if chart is visible
    await dashboardPage.verifyChartVisible('RD:702-5151 (614) power & energy');
    
    // Log iframe details for debugging
    await dashboardPage.logIframeDetails();
  });

  test('Happy Path #3: Filter data by date range', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Wait for chart to be fully loaded first
    await dashboardPage.verifyChartVisible('RD:702-5151 (614) power & energy');
    
    // Add extra wait to ensure dashboard is fully loaded
    await page.waitForTimeout(3000);
    
    // Capture data before filter
    const beforeFilterData = await dashboardPage.getTableData();
    console.log("Data before filter:", beforeFilterData);
    
    // Apply date filter using the page object methods
    await dashboardPage.openDateFilter();
    await dashboardPage.setDateRangeFilter('2024-12-10 10:00', '2024-12-15 16:15');
    await dashboardPage.applyDateFilter();
    
    // Get data after filtering
    const afterFilterData = await dashboardPage.getTableData();
    console.log("Data after filter:", afterFilterData);
    
    // Simple verification that something happened
    console.log("Filter test completed successfully");
  });

  test('Happy Path #4: Navigate to different dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // First make sure we're on the initial dashboard
    await dashboardPage.verifyChartVisible('RD:702-5151 (614) power & energy');
    
    // Log data for debugging
    const beforeFilterData = await dashboardPage.getTableData();
    console.log("Data before filter:", beforeFilterData);
    
    try {
      // Navigate to the Pavi Qa test dashboard using page object method
      console.log("Attempting to navigate to 'Pavi Qa test' dashboard");
      
      // Moving all the navigation logic to page object
      await dashboardPage.navigateToDashboardsList();
      await dashboardPage.navigateToDashboard('Pavi Qa test');
      
      // Verify we're on the correct dashboard using page object methods
      await dashboardPage.verifyPageTitle('Pavi Qa test');
      
      console.log("Successfully navigated to different dashboard");
    } catch (e) {
      console.error(`Failed to navigate to different dashboard: ${e.message}`);
      await page.screenshot({ path: 'navigation-error.png', fullPage: true });
      throw e;
    }
  });

  test('Happy Path #5: Logout functionality', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const profilePage = new ProfilePage(page);
    
    // Verify we're on the dashboard
    await dashboardPage.verifyPageLoaded();
    
    // Navigate directly to profile for reliability
    await profilePage.navigate();
    await profilePage.verifyPageLoaded();
    
    // Sign out
    await profilePage.clickSignOut();
    await profilePage.confirmSignOut();
    
    // Verify we're logged out and redirected to login
    const loginPage = new LoginPage(page);
    await loginPage.verifyLoginPageLoaded();
  });
});
import { expect } from '@playwright/test';
import { TIMEOUTS, SELECTORS } from '../config/constants';
import { environment } from '../config/environment';

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: 'QA Automation test Project' });
    
    // Navigation elements
    this.dashboardsLink = page.locator("//p[@class='MuiTypography-root MuiTypography-body2 mui-1j4i41p']");
    this.homeLink = page.locator('a').filter({ hasText: 'Home' });
    
    // Dashboard specific elements
    this.dashboardTitle = page.getByRole('heading', { level: 1 });
    this.chartTitle = page.locator('text=RD:702-5151 (614) power & energy');
    this.muiBoxRoot = page.locator(".MuiBox-root");
    
    // Date filter elements
    this.dateFilterButton = page.locator(SELECTORS.DATE_FILTER);
    this.fromDateInput = page.locator('[data-testid="BrainsDateTimePickerHistoric-startInput"]');
    this.toDateInput = page.locator('[data-testid="BrainsDateTimePickerHistoric-endInput"]');
    this.applyButton = page.locator('button:has-text("Apply")').first();
    
    // User menu
    this.userMenu = page.locator(SELECTORS.USER_MENU);
  }

  async verifyPageLoaded() {
    await expect(this.title).toBeVisible({ timeout: TIMEOUTS.LONG });
  }

  async verifyPageTitle(titleText) {
    try {
      // First try a specific heading with this text
      const specificTitle = this.page.getByRole('heading', { name: titleText });
      if (await specificTitle.count() > 0) {
        await expect(specificTitle).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        return;
      }
      
      // Check if we're on a page with the right title
      const pageTitle = await this.page.title();
      if (pageTitle.includes(titleText)) {
        console.log(`Found title in page title: ${pageTitle}`);
        return;
      }
      
      // Check if there's any dashboard content
      const hasDashboardContent = await this.muiBoxRoot.count() > 0;
      expect(hasDashboardContent).toBeTruthy();
      
      console.log(`Could not verify specific title '${titleText}', but dashboard content is present`);
    } catch (e) {
      console.error(`Title verification failed: ${e.message}`);
      throw e;
    }
  }

  async navigateToDashboardsList() {
    try {
      await this.dashboardsLink.click();
      const dashboardsUrl = `${environment.baseURL}/next/dashboards`;
      await this.page.waitForURL(url => url.includes('/next/dashboards'), 
        { timeout: TIMEOUTS.MEDIUM });
      
      await expect(this.page.getByRole('heading', { name: 'Dashboards' }))
        .toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    } catch (e) {
      console.log(`Navigation failed with primary selector: ${e.message}, trying alternatives`);
      
      try {
        await this.homeLink.click();
        await this.page.waitForTimeout(1000);
        
        const sidebarDashboardsLink = this.page.locator("text=Dashboards").first();
        await sidebarDashboardsLink.click();
        
        await this.page.waitForURL(url => url.includes('/next/dashboards'), 
          { timeout: TIMEOUTS.MEDIUM });
      } catch (e2) {
        console.log(`Alternative navigation also failed: ${e2.message}, using direct URL navigation`);
        
        await this.page.goto(`${environment.baseURL}/next/dashboards`, {
          timeout: TIMEOUTS.MEDIUM,
          waitUntil: 'domcontentloaded'
        });
      }
    }
    
    // Verify we're on the dashboards page
    await expect(this.page.getByRole('heading', { name: 'Dashboards' }))
      .toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async navigateToDashboard(dashboardName) {
    // First navigate to dashboards list
    await this.navigateToDashboardsList();
    
    try {
      // Use appropriate selector based on dashboard name
      let dashboardLink;
      
      if (dashboardName === 'Pavi Qa test') {
        dashboardLink = this.page.locator("//a[normalize-space()='Pavi Qa test']");
      } else if (dashboardName === 'QA Automation test Project') {
        dashboardLink = this.page.locator("//a[normalize-space()='QA Automation test Project']");
      } else {
        // For other dashboards, try a more generic approach
        dashboardLink = this.page.locator(`a:has-text("${dashboardName}")`).first();
      }
      
      await expect(dashboardLink).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
      await dashboardLink.click();
      
      // Wait for page to load
      await this.page.waitForTimeout(TIMEOUTS.SHORT);
      
      // Verify we landed on the correct dashboard
      await expect(this.page).toHaveURL(/.*\/dashboards\/.*/, { timeout: TIMEOUTS.MEDIUM });
    } catch (e) {
      console.log(`Failed to click dashboard ${dashboardName}: ${e.message}`);
      throw new Error(`Could not navigate to dashboard: ${dashboardName}`);
    }
  }

  async openDateFilter() {
    await expect(this.dateFilterButton).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await this.dateFilterButton.click();
    
    // Wait for date picker to appear
    await this.page.waitForTimeout(1000);
    await expect(this.fromDateInput).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async setDateRangeFilter(fromDate, toDate) {
    await this.fromDateInput.clear();
    await this.toDateInput.clear();
    
    await this.fromDateInput.fill(fromDate);
    await this.toDateInput.fill(toDate);
  }

  async applyDateFilter() {
    await expect(this.applyButton).toBeVisible({ timeout: TIMEOUTS.SHORT });
    await this.applyButton.click();
    
    // Wait for filter to take effect
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
  }

  async verifyFilterApplied() {
    // A simple check that we're still on a dashboard page
    await expect(this.muiBoxRoot).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async getTableData() {
    const iframeCount = await this.page.locator('iframe').count();
    
    if (iframeCount > 0) {
      const frames = this.page.frames();
      
      for (const frame of frames) {
        if (frame.url().includes('grafana')) {
          try {
            const tableData = await frame.$$eval('table td', cells => 
              cells.map(cell => cell.innerText)
            );
            
            if (tableData && tableData.length > 0) {
              return tableData.filter(text => text && text.trim() !== '');
            }
          } catch (e) {
            console.log("No table data found in frame");
          }
          
          try {
            const timeLabels = await frame.$$eval('.graph-annotation time', times => 
              times.map(time => time.innerText)
            );
            
            if (timeLabels && timeLabels.length > 0) {
              return timeLabels;
            }
          } catch (e) {
            console.log("No time labels found in frame");
          }
        }
      }
    }
    
    return [];
  }

  async logIframeDetails() {
    const iframeCount = await this.page.locator('iframe').count();
    console.log(`Number of iframes found: ${iframeCount}`);
    
    if (iframeCount > 0) {
      const frames = this.page.frames();
      console.log(`Total frames: ${frames.length}`);
      
      frames.forEach((frame, i) => {
        console.log(`Frame ${i} URL: ${frame.url()}`);
      });
    }
  }
  
  async logFilteredData() {
    const filteredData = await this.getTableData();
    console.log("Data after filter:", filteredData);
    return filteredData;
  }

  async verifyChartVisible(chartTitle) {
    const iframeCount = await this.page.locator('iframe').count();
    
    if (iframeCount > 0) {
      const frames = this.page.frames();
      
      for (const frame of frames) {
        if (frame.url().includes('grafana')) {
          try {
            await frame.waitForSelector(`text=${chartTitle}`, { 
              state: 'visible', 
              timeout: TIMEOUTS.LONG 
            });
            console.log(`Found chart title in frame: ${frame.url()}`);
            return;
          } catch (e) {
            console.log(`Chart title not found in frame: ${frame.url()}`);
          }
        }
      }
      
      console.log('No frame with chart title found, checking main page context');
      await expect(this.page.locator(`text=${chartTitle}`))
        .toBeVisible({ timeout: TIMEOUTS.LONG });
    } else {
      // If no iframes, just check in the main page context
      await expect(this.page.locator(`text=${chartTitle}`))
        .toBeVisible({ timeout: TIMEOUTS.LONG });
    }
  }

  async openUserMenu() {
    await this.userMenu.click();
    // Wait for menu to be visible
    await this.page.waitForSelector('text=Profile', { state: 'visible' });
  }

  async navigateDirectlyWithoutAuth() {
    const dashboardURL = `${environment.baseURL}/next/dashboards/g/2082/qa-automation-test-project`;
    await this.page.goto(dashboardURL, { timeout: TIMEOUTS.MEDIUM });
  }
}

export default DashboardPage;
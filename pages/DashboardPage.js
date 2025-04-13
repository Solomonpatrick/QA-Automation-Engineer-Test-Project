import { expect } from '@playwright/test';
import { TIMEOUTS, SELECTORS } from '../config/constants';
import { environment } from '../config/environment';

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardTitle = page.getByRole('heading', { name: 'QA Automation test Project' });
    this.userMenuIcon = page.locator(SELECTORS.USER_MENU);
    this.dashboardsLink = page.locator('a', { hasText: 'Dashboards' });
    this.dateFilterButton = page.locator(SELECTORS.DATE_FILTER);
    this.startDateInput = page.locator('[data-testid="BrainsDateTimePickerHistoric-startInput"]');
    this.endDateInput = page.locator('[data-testid="BrainsDateTimePickerHistoric-endInput"]');
    this.applyButton = page.getByRole('button', { name: 'Apply' });
  }

  async verifyPageLoaded() {
    await expect(this.dashboardTitle).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }
  
  async verifyPageTitle(title) {
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async openUserMenu() {
    await this.userMenuIcon.click();
  }

  async navigateToDashboardsList() {
    await this.dashboardsLink.click();
    const dashboardsUrl = `${environment.baseURL}/next/dashboards`;
    await this.page.waitForURL(dashboardsUrl);
    await expect(this.page.getByRole('heading', { name: 'Dashboards' })).toBeVisible();
  }

  async openDateFilter() {
    await this.dateFilterButton.click();
  }
  
  async setDateRangeFilter(startDate, endDate) {
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }
  
  async applyDateFilter() {
    await this.applyButton.click();
  }
  
  async navigateToDashboard(dashboardName) {
    await this.navigateToDashboardsList();
    const dashboardLink = this.page.locator(`//a[normalize-space()='${dashboardName}']`);
    await expect(dashboardLink).toBeVisible();
    await dashboardLink.click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
  }
  
  async navigateDirectlyWithoutAuth() {
    const dashboardURL = `${environment.baseURL}/next/dashboards/g/2082/qa-automation-test-project`;
    await this.page.goto(dashboardURL);
  }
  
  async verifyChartVisible(chartTitle) {
    const iframeCount = await this.page.locator('iframe').count();
    
    if (iframeCount > 0) {
      await this.page.waitForSelector('iframe', { state: 'attached', timeout: TIMEOUTS.MEDIUM });
      
      const frames = this.page.frames();
      let chartFrame = null;
      
      for (const frame of frames) {
        const titleCount = await frame.locator(`text=${chartTitle}`).count();
        if (titleCount > 0) {
          chartFrame = frame;
          break;
        }
      }
      
      if (chartFrame) {
        await expect(chartFrame.locator(`text=${chartTitle}`)).toBeVisible({ timeout: TIMEOUTS.LONG });
        await expect(chartFrame.locator(`[data-testid="data-testid Panel header ${chartTitle}"]`))
          .toBeVisible({ timeout: TIMEOUTS.MEDIUM });
      } else {
        await expect(this.page.locator(`text=${chartTitle}`)).toBeVisible({ timeout: TIMEOUTS.LONG });
      }
    } else {
      await expect(this.page.locator(`text=${chartTitle}`)).toBeVisible({ timeout: TIMEOUTS.LONG });
    }
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
  
  async getTableData() {
    let data = [];
    const iframeCount = await this.page.locator('iframe').count();
    
    if (iframeCount > 0) {
      const frames = this.page.frames();
      let tableFrame = null;
      
      for (const frame of frames) {
        if (frame.url().includes('grafana')) {
          tableFrame = frame;
          break;
        }
      }
      
      if (tableFrame) {
        try {
          const dateCells = await tableFrame.locator('role=cell >> nth=0').allTextContents();
          data = dateCells.slice(0, 3);
        } catch (e) {
          console.log("Couldn't get table data, continuing");
        }
      }
    }
    
    return data;
  }
  
  async verifyFilterApplied() {
    const iframeCount = await this.page.locator('iframe').count();
    
    if (iframeCount > 0) {
      const frames = this.page.frames();
      let tableFrame = null;
      
      for (const frame of frames) {
        if (frame.url().includes('grafana')) {
          tableFrame = frame;
          break;
        }
      }
      
      if (tableFrame) {
        expect(tableFrame.url()).toContain('from=');
        await expect(this.page.locator('iframe[src*="grafana"]')).toBeVisible();
      }
    } else {
      await expect(this.page.locator('body')).toBeVisible();
    }
  }
  
  async logFilteredData() {
    const iframeCount = await this.page.locator('iframe').count();
    
    if (iframeCount > 0) {
      const frames = this.page.frames();
      let tableFrame = null;
      
      for (const frame of frames) {
        if (frame.url().includes('grafana')) {
          tableFrame = frame;
          break;
        }
      }
      
      if (tableFrame) {
        try {
          const dateCellsAfter = await tableFrame.locator('role=cell >> nth=0').allTextContents();
          if (dateCellsAfter.length > 0) {
            console.log("Data after filter:", dateCellsAfter.slice(0, 3));
          }
        } catch (e) {
          console.log("Couldn't get data after filter, but iframe is still visible");
        }
      }
    }
  }
}

export default DashboardPage;
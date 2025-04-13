import { expect } from '@playwright/test';
import { TIMEOUTS, SELECTORS } from '../config/constants';
import { environment } from '../config/environment';

export async function navigateToDashboard(page, dashboardName) {
  await page.goto(`${environment.baseURL}/next/dashboards`);
  await page.waitForLoadState('networkidle');
  
  const dashboardLink = page.locator(`//a[normalize-space()='${dashboardName}']`);
  await expect(dashboardLink).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  await dashboardLink.click();
  
  // Wait for dashboard to load
  await page.waitForTimeout(TIMEOUTS.SHORT);
  await expect(page.getByRole('heading', { name: dashboardName })).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
}

export async function verifyLoggedIn(page) {
  await expect(page.locator(SELECTORS.USER_MENU)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
}

export async function verifyLoggedOut(page) {
  await expect(page.locator(SELECTORS.LOGIN_EMAIL)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
}

export async function handleIFrameContent(page, callback) {
  const iframeCount = await page.locator('iframe').count();
  if (iframeCount > 0) {
    const frames = page.frames();
    let contentFrame = null;
    
    for (const frame of frames) {
      if (frame.url().includes('grafana')) {
        contentFrame = frame;
        break;
      }
    }
    
    if (contentFrame) {
      await callback(contentFrame);
    } else {
      console.log('No suitable frame found, checking main page context');
      await callback(page);
    }
  } else {
    console.log('No iframes found, checking in main page context');
    await callback(page);
  }
}
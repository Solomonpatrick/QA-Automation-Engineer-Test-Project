// 1 // From dashboard.spec.js
await expect(page.locator('text=RD:702-5151 (614) power & energy'))
  .toBeVisible({ timeout: 20000 });
// 2
await paviQaTest.click();
// This would timeout waiting for network idle
await page.waitForLoadState('networkidle');

// 3
// This caused failures in dashboard.spec.js
await page.getByText('Profile').click();
// We had to replace it with a direct URL navigation
const profileUrl = `${environment.baseURL}/next/profile`;
await page.goto(profileUrl);

// 4 dashboard.spec.js & negative.spec.js
await page.fill('input[id=":R2ij7ulqjt9kq:"]', credentials.standard.email);
await page.fill('input[id=":R6jj7ulqjt9kq:"]', credentials.standard.password);
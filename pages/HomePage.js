import { expect } from '@playwright/test';
import { TIMEOUTS } from '../config/constants';

class HomePage {
  constructor(page) {
    this.page = page;
    // Locators for the home page
    this.pageTitle = page.getByRole('heading', { name: 'Home' });
    this.projectsSection = page.locator('.projects-section');
  }

  async verifyPageLoaded() {
    // Verify home page is loaded by checking for the title
    await expect(this.pageTitle).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }
  
  async navigateToDashboard(dashboardName) {
    // Click on the specified dashboard project
    const dashboardLink = this.page.locator(`text=${dashboardName}`);
    await expect(dashboardLink).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await dashboardLink.click();
  }
  
  async getAllProjects() {
    // Get a list of all available projects on the home page
    const projectLinks = await this.page.locator('.project-card').all();
    return projectLinks.map(async (link) => {
      return await link.innerText();
    });
  }
  
  async searchProject(searchText) {
    // If there's a search functionality on the home page
    const searchInput = this.page.locator('input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill(searchText);
      await searchInput.press('Enter');
    }
  }
}

export default HomePage;
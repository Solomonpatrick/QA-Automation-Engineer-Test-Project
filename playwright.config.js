import { defineConfig, devices } from '@playwright/test';
import { environment } from './config/environment';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel but with fewer workers to reduce resource contention */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1, // Changed to just 1 retry instead of conditional
  workers: process.env.CI ? 1 : 2,
  timeout: 180000,  
  reporter: [
    ['list'],    
    ['html', { outputFolder: 'test-report' }],    
    ['json', { outputFile: 'test-report/results.json' }]  
  ],
  use: {
    baseURL: environment.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-sandbox', // Needed for some CI environments
      ],
    },
    navigationTimeout: 90000,    
    actionTimeout: 45000,    
    contextOptions: {
      ignoreHTTPSErrors: true    
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    }
  ],
  webServer: process.env.USE_LOCAL_SERVER ? {
    command: 'npm run start:server',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  } : undefined,
});
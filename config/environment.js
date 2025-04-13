/**
 * Environment configuration
 * This file contains environment-specific configuration settings
 */

// Default to local environment if not specified
const currentEnv = process.env.TEST_ENV || 'qa';

// Environment configurations
const environments = {
  local: {
    baseURL: 'http://localhost:3000',
    loginPath: 'http://localhost:3000/next/signin',
    apiBaseUrl: 'http://localhost:3001/api'
  },
  qa: {
    baseURL: process.env.BASE_URL || 'https://qa-test.intellisense.io',
    loginPath: process.env.BASE_URL ? `${process.env.BASE_URL}/next/signin` : 'https://qa-test.intellisense.io/next/signin',
    apiBaseUrl: process.env.API_BASE_URL || 'https://qa-test.intellisense.io/api'
  },
  staging: {
    baseURL: process.env.BASE_URL || 'https://staging.intellisense.io',
    loginPath: process.env.BASE_URL ? `${process.env.BASE_URL}/next/signin` : 'https://staging.intellisense.io/next/signin',
    apiBaseUrl: process.env.API_BASE_URL || 'https://staging.intellisense.io/api'
  },
  production: {
    baseURL: process.env.BASE_URL || 'https://app.intellisense.io',
    loginPath: process.env.BASE_URL ? `${process.env.BASE_URL}/next/signin` : 'https://app.intellisense.io/next/signin',
    apiBaseUrl: process.env.API_BASE_URL || 'https://app.intellisense.io/api'
  }
};

// Export the environment configuration
export const environment = environments[currentEnv];

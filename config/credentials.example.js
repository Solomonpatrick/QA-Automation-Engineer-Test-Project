/**
 * Example credentials file for CI configuration
 * 
 * Instructions:
 * 1. Copy this file to credentials.js
 * 2. Replace placeholder values with actual credentials
 * 3. Ensure credentials.js is in .gitignore to prevent committing actual credentials
 * 
 * For CI environments:
 * - Use environment variables or secrets management
 * - Configure your CI pipeline to inject these values during runtime
 */

export const credentials = {
  // Standard user with basic permissions
  standard: {
    email: process.env.QA_STANDARD_USER_EMAIL || 'standard_user@example.com',
    password: process.env.QA_STANDARD_USER_PASSWORD || 'replace_with_actual_password',
    username: process.env.QA_STANDARD_USER_NAME || 'QA Standard User'
  },
  
  // Admin user with elevated permissions
  admin: {
    email: process.env.QA_ADMIN_USER_EMAIL || 'admin_user@example.com',
    password: process.env.QA_ADMIN_USER_PASSWORD || 'replace_with_actual_password',
    username: process.env.QA_ADMIN_USER_NAME || 'QA Admin User'
  },
  
  // Read-only user with limited permissions
  readonly: {
    email: process.env.QA_READONLY_USER_EMAIL || 'readonly_user@example.com',
    password: process.env.QA_READONLY_USER_PASSWORD || 'replace_with_actual_password',
    username: process.env.QA_READONLY_USER_NAME || 'QA ReadOnly User'
  }
};
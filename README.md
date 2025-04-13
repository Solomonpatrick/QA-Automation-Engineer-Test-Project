## Setting Up Credentials

For security reasons, test credentials are not committed to the repository. Follow these steps to set up credentials:

### Local Development

1. Copy `config/credentials.example.js` to `config/credentials.js`
2. Replace the placeholder values with actual credentials

```bash
cp config/credentials.example.js config/credentials.js
```

### CI Environment

For CI environments, set the following environment variables or secrets:

| Variable | Description |
|----------|-------------|
| QA_STANDARD_USER_EMAIL | Email for standard test user |
| QA_STANDARD_USER_PASSWORD | Password for standard test user |
| QA_ADMIN_USER_EMAIL | Email for admin test user |
| QA_ADMIN_USER_PASSWORD | Password for admin test user |
| QA_READONLY_USER_EMAIL | Email for read-only test user |
| QA_READONLY_USER_PASSWORD | Password for read-only test user |
| BASE_URL | Base URL for the test environment |

#### Setting up GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets > Actions
3. Click "New repository secret"
4. Add each of the required variables listed above
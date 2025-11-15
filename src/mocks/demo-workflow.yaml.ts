/**
 * Example GitHub Actions workflow for the interactive demo
 * This represents a realistic CI/CD pipeline for a web application
 */
export const DEMO_WORKFLOW_YAML = `name: E-Commerce Microservices Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  setup:
    name: Setup Environment
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}

  build-auth:
    name: Build Auth Service
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build auth service
        run: npm run build:auth

      - name: Upload auth artifacts
        uses: actions/upload-artifact@v3
        with:
          name: auth-service
          path: dist/auth

  build-api:
    name: Build API Gateway
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build API gateway
        run: npm run build:api

      - name: Upload API artifacts
        uses: actions/upload-artifact@v3
        with:
          name: api-gateway
          path: dist/api

  build-frontend:
    name: Build Frontend
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build frontend
        run: npm run build:frontend

      - name: Upload frontend artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend
          path: dist/frontend

  test-auth:
    name: Test Auth Service
    runs-on: ubuntu-latest
    needs: build-auth
    steps:
      - name: Download auth artifacts
        uses: actions/download-artifact@v3
        with:
          name: auth-service

      - name: Run auth tests
        run: npm run test:auth

      - name: Generate coverage report
        run: npm run coverage:auth

  test-api:
    name: Test API Gateway
    runs-on: ubuntu-latest
    needs: build-api
    steps:
      - name: Download API artifacts
        uses: actions/download-artifact@v3
        with:
          name: api-gateway

      - name: Run API tests
        run: npm run test:api

      - name: Generate coverage report
        run: npm run coverage:api

  test-frontend:
    name: Test Frontend
    runs-on: ubuntu-latest
    needs: build-frontend
    steps:
      - name: Download frontend artifacts
        uses: actions/download-artifact@v3
        with:
          name: frontend

      - name: Run frontend tests
        run: npm run test:frontend

      - name: Run Playwright E2E tests
        run: npm run test:e2e

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: [test-auth, test-api, test-frontend]
    steps:
      - name: Setup test environment
        run: docker-compose up -d

      - name: Run integration tests
        run: npm run test:integration

      - name: Teardown test environment
        run: docker-compose down

  security-scan:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: integration-tests
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run dependency audit
        run: npm audit --audit-level=moderate

      - name: Run SAST scan
        uses: github/codeql-action/analyze@v2

      - name: Container security scan
        run: npm run security:scan

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: security-scan
    environment: staging
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v3

      - name: Deploy to staging
        run: npm run deploy:staging
        env:
          DEPLOY_TOKEN: \${{ secrets.STAGING_DEPLOY_TOKEN }}

      - name: Run smoke tests
        run: npm run test:smoke

  e2e-staging:
    name: E2E Tests on Staging
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment: staging
    steps:
      - name: Run E2E tests on staging
        run: npm run test:e2e:staging
        env:
          STAGING_URL: https://staging.example.com

      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: e2e-results
          path: test-results/

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: e2e-staging
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v3

      - name: Deploy to production
        run: npm run deploy:production
        env:
          DEPLOY_TOKEN: \${{ secrets.PROD_DEPLOY_TOKEN }}

      - name: Verify deployment
        run: npm run verify:production

      - name: Notify team
        run: npm run notify:slack
`;

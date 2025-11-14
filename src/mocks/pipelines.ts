import { ParseResponse } from '../types/api.types';

/**
 * Mock pipeline data for demonstration and testing
 */

export const mockGitHubPipeline: ParseResponse = {
  id: 'mock-gh-1',
  platform: 'github',
  name: 'CI/CD Pipeline',
  jobs: [
    {
      id: 'install',
      name: 'install',
      dependencies: [],
      steps: [
        { name: 'Checkout code', uses: 'actions/checkout@v4' },
        { name: 'Setup Node.js', uses: 'actions/setup-node@v4' },
        { name: 'Install dependencies', run: 'npm ci' },
      ],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'lint',
      name: 'lint',
      dependencies: ['install'],
      steps: [
        { name: 'Run ESLint', run: 'npm run lint' },
        { name: 'Check formatting', run: 'npm run format:check' },
      ],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'test',
      name: 'test',
      dependencies: ['install'],
      steps: [
        { name: 'Run unit tests', run: 'npm run test' },
        { name: 'Generate coverage', run: 'npm run test:coverage' },
      ],
      environment: { CI: 'true' },
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'build',
      name: 'build',
      dependencies: ['lint', 'test'],
      steps: [
        { name: 'TypeScript type check', run: 'npm run type-check' },
        { name: 'Build application', run: 'npm run build' },
      ],
      environment: { NODE_ENV: 'production' },
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'e2e',
      name: 'e2e',
      dependencies: ['build'],
      steps: [
        { name: 'Install Playwright', run: 'npx playwright install' },
        { name: 'Run E2E tests', run: 'npm run test:e2e' },
      ],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'deploy',
      name: 'deploy',
      dependencies: ['e2e'],
      steps: [
        { name: 'Deploy to staging', run: './scripts/deploy-staging.sh' },
        { name: 'Run smoke tests', run: './scripts/smoke-test.sh' },
      ],
      environment: { DEPLOY_ENV: 'staging' },
      runsOn: 'ubuntu-latest',
    },
  ],
  metadata: {
    totalJobs: 6,
    parsedAt: new Date().toISOString(),
  },
};

export const mockGitLabPipeline: ParseResponse = {
  id: 'mock-gl-1',
  platform: 'gitlab',
  name: 'GitLab CI Pipeline',
  jobs: [
    {
      id: 'build-frontend',
      name: 'build:frontend',
      dependencies: [],
      steps: [
        { name: 'Install dependencies', run: 'npm ci' },
        { name: 'Build frontend', run: 'npm run build' },
      ],
      environment: {},
      runsOn: 'docker',
    },
    {
      id: 'build-backend',
      name: 'build:backend',
      dependencies: [],
      steps: [
        { name: 'Install dependencies', run: 'go mod download' },
        { name: 'Build backend', run: 'go build -o app' },
      ],
      environment: {},
      runsOn: 'docker',
    },
    {
      id: 'test-frontend',
      name: 'test:frontend',
      dependencies: ['build-frontend'],
      steps: [{ name: 'Unit tests', run: 'npm run test' }],
      environment: {},
      runsOn: 'docker',
    },
    {
      id: 'test-backend',
      name: 'test:backend',
      dependencies: ['build-backend'],
      steps: [{ name: 'Unit tests', run: 'go test ./...' }],
      environment: {},
      runsOn: 'docker',
    },
    {
      id: 'integration-tests',
      name: 'test:integration',
      dependencies: ['test-frontend', 'test-backend'],
      steps: [
        { name: 'Setup test environment', run: 'docker-compose up -d' },
        { name: 'Run integration tests', run: 'npm run test:integration' },
      ],
      environment: { DATABASE_URL: 'postgres://test:test@localhost:5432/testdb' },
      runsOn: 'docker',
    },
    {
      id: 'deploy-production',
      name: 'deploy:production',
      dependencies: ['integration-tests'],
      steps: [{ name: 'Deploy to production', run: 'kubectl apply -f k8s/' }],
      environment: { KUBE_CONTEXT: 'production' },
      runsOn: 'docker',
    },
  ],
  metadata: {
    totalJobs: 6,
    parsedAt: new Date().toISOString(),
  },
};

export const mockComplexPipeline: ParseResponse = {
  id: 'mock-complex-1',
  platform: 'github',
  name: 'E-Commerce Microservices CI/CD',
  jobs: [
    {
      id: 'setup',
      name: '🔧 Environment Setup',
      dependencies: [],
      steps: [
        { name: 'Checkout repository', uses: 'actions/checkout@v4' },
        { name: 'Setup Node.js 20', uses: 'actions/setup-node@v4' },
        { name: 'Cache dependencies', uses: 'actions/cache@v3' },
        { name: 'Install shared tools', run: 'npm install -g pnpm turborepo' },
      ],
      environment: { NODE_ENV: 'ci' },
      runsOn: 'ubuntu-latest',
      x: 100,
      y: 400,
    },
    {
      id: 'build-auth',
      name: '🔐 Auth Service',
      dependencies: ['setup'],
      steps: [
        { name: 'Install dependencies', run: 'pnpm install --filter @shop/auth' },
        { name: 'Build auth service', run: 'pnpm build --filter @shop/auth' },
        { name: 'Build Docker image', run: 'docker build -t shop/auth:latest ./services/auth' },
      ],
      environment: { SERVICE: 'auth' },
      runsOn: 'ubuntu-latest',
      x: 300,
      y: 200,
    },
    {
      id: 'build-api',
      name: '⚡ API Gateway',
      dependencies: ['setup'],
      steps: [
        { name: 'Install dependencies', run: 'pnpm install --filter @shop/api' },
        { name: 'Generate GraphQL types', run: 'pnpm codegen --filter @shop/api' },
        { name: 'Build API gateway', run: 'pnpm build --filter @shop/api' },
        { name: 'Build Docker image', run: 'docker build -t shop/api:latest ./services/api' },
      ],
      environment: { SERVICE: 'api' },
      runsOn: 'ubuntu-latest',
      x: 300,
      y: 400,
    },
    {
      id: 'build-frontend',
      name: '🎨 Web Frontend',
      dependencies: ['setup'],
      steps: [
        { name: 'Install dependencies', run: 'pnpm install --filter @shop/web' },
        { name: 'Lint code', run: 'pnpm lint --filter @shop/web' },
        { name: 'Build Next.js app', run: 'pnpm build --filter @shop/web' },
        { name: 'Optimize bundle', run: 'pnpm analyze-bundle' },
      ],
      environment: { NEXT_PUBLIC_ENV: 'production' },
      runsOn: 'ubuntu-latest',
      x: 300,
      y: 600,
    },
    {
      id: 'test-auth',
      name: '🧪 Test Auth',
      dependencies: ['build-auth'],
      steps: [
        { name: 'Unit tests', run: 'pnpm test --filter @shop/auth' },
        { name: 'Coverage report', run: 'pnpm coverage --filter @shop/auth' },
        { name: 'Upload coverage', uses: 'codecov/codecov-action@v3' },
      ],
      environment: { CI: 'true' },
      runsOn: 'ubuntu-latest',
      x: 500,
      y: 200,
    },
    {
      id: 'test-api',
      name: '🧪 Test API',
      dependencies: ['build-api'],
      steps: [
        { name: 'Unit tests', run: 'pnpm test --filter @shop/api' },
        { name: 'Integration tests', run: 'pnpm test:integration --filter @shop/api' },
        { name: 'Coverage report', run: 'pnpm coverage --filter @shop/api' },
      ],
      environment: { CI: 'true', DATABASE_URL: 'postgres://test:test@localhost:5432/testdb' },
      runsOn: 'ubuntu-latest',
      x: 500,
      y: 400,
    },
    {
      id: 'test-frontend',
      name: '🧪 Test Frontend',
      dependencies: ['build-frontend'],
      steps: [
        { name: 'Unit tests', run: 'pnpm test --filter @shop/web' },
        { name: 'Component tests', run: 'pnpm test:component --filter @shop/web' },
        { name: 'A11y tests', run: 'pnpm test:a11y --filter @shop/web' },
      ],
      environment: { CI: 'true' },
      runsOn: 'ubuntu-latest',
      x: 500,
      y: 600,
    },
    {
      id: 'integration',
      name: '🔗 Integration Tests',
      dependencies: ['test-auth', 'test-api', 'test-frontend'],
      steps: [
        { name: 'Start services', run: 'docker-compose -f docker-compose.test.yml up -d' },
        { name: 'Wait for health checks', run: './scripts/wait-for-services.sh' },
        { name: 'Run integration suite', run: 'pnpm test:integration' },
        { name: 'Stop services', run: 'docker-compose -f docker-compose.test.yml down' },
      ],
      environment: { TEST_ENV: 'integration' },
      runsOn: 'ubuntu-latest',
      x: 700,
      y: 400,
    },
    {
      id: 'security',
      name: '🛡️ Security Scan',
      dependencies: ['integration'],
      steps: [
        { name: 'Trivy vulnerability scan', run: 'trivy image --severity HIGH,CRITICAL shop/auth:latest' },
        { name: 'SAST analysis', run: 'semgrep --config auto' },
        { name: 'Dependency audit', run: 'pnpm audit --audit-level moderate' },
        { name: 'License check', run: 'pnpm licenses check' },
      ],
      environment: {},
      runsOn: 'ubuntu-latest',
      x: 900,
      y: 400,
    },
    {
      id: 'deploy-staging',
      name: '🚀 Deploy Staging',
      dependencies: ['security'],
      steps: [
        { name: 'Configure kubectl', run: 'aws eks update-kubeconfig --name staging-cluster' },
        { name: 'Deploy to staging', run: 'kubectl apply -k k8s/overlays/staging' },
        { name: 'Wait for rollout', run: 'kubectl rollout status deployment/shop-api -n staging' },
        { name: 'Run smoke tests', run: './scripts/smoke-tests.sh https://staging.shop.example.com' },
      ],
      environment: { KUBE_CONTEXT: 'staging', AWS_REGION: 'us-east-1' },
      runsOn: 'ubuntu-latest',
      x: 1100,
      y: 300,
    },
    {
      id: 'e2e',
      name: '🎭 E2E Tests',
      dependencies: ['deploy-staging'],
      steps: [
        { name: 'Install Playwright', run: 'pnpm exec playwright install --with-deps' },
        { name: 'Run E2E suite', run: 'pnpm test:e2e --baseUrl=https://staging.shop.example.com' },
        { name: 'Upload test results', uses: 'actions/upload-artifact@v3' },
        { name: 'Generate HTML report', run: 'pnpm exec playwright show-report' },
      ],
      environment: { PLAYWRIGHT_BASE_URL: 'https://staging.shop.example.com' },
      runsOn: 'ubuntu-latest',
      x: 1300,
      y: 300,
    },
    {
      id: 'deploy-prod',
      name: '🌟 Production Deploy',
      dependencies: ['e2e'],
      steps: [
        { name: 'Configure kubectl', run: 'aws eks update-kubeconfig --name prod-cluster' },
        { name: 'Deploy to production', run: 'kubectl apply -k k8s/overlays/production' },
        { name: 'Wait for rollout', run: 'kubectl rollout status deployment/shop-api -n production' },
        { name: 'Verify deployment', run: './scripts/verify-deployment.sh https://shop.example.com' },
        { name: 'Notify Slack', run: 'curl -X POST $SLACK_WEBHOOK -d "Deployment successful!"' },
      ],
      environment: { KUBE_CONTEXT: 'production', AWS_REGION: 'us-east-1' },
      runsOn: 'ubuntu-latest',
      x: 1500,
      y: 400,
    },
  ],
  metadata: {
    totalJobs: 12,
    parsedAt: new Date().toISOString(),
  },
};

// Sample YAML configurations for testing
export const sampleGitHubYAML = `name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci

  lint:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
      - run: npm run format:check

  test:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - run: npm run test
      - run: npm run test:coverage

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - run: npm run type-check
      - run: npm run build

  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright install
      - run: npm run test:e2e

  deploy:
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - run: ./scripts/deploy-staging.sh
      - run: ./scripts/smoke-test.sh
`;

export const sampleGitLabYAML = `stages:
  - build
  - test
  - integration
  - deploy

build:frontend:
  stage: build
  script:
    - npm ci
    - npm run build

build:backend:
  stage: build
  script:
    - go mod download
    - go build -o app

test:frontend:
  stage: test
  needs: [build:frontend]
  script:
    - npm run test

test:backend:
  stage: test
  needs: [build:backend]
  script:
    - go test ./...

test:integration:
  stage: integration
  needs: [test:frontend, test:backend]
  script:
    - docker-compose up -d
    - npm run test:integration

deploy:production:
  stage: deploy
  needs: [test:integration]
  script:
    - kubectl apply -f k8s/
  environment:
    name: production
`;

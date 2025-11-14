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
  name: 'Complex Microservices Pipeline',
  jobs: [
    {
      id: 'setup',
      name: 'setup',
      dependencies: [],
      steps: [{ name: 'Initialize', run: 'init.sh' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'build-auth',
      name: 'build:auth-service',
      dependencies: ['setup'],
      steps: [{ name: 'Build auth service', run: 'docker build auth/' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'build-api',
      name: 'build:api-service',
      dependencies: ['setup'],
      steps: [{ name: 'Build API service', run: 'docker build api/' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'build-frontend',
      name: 'build:frontend',
      dependencies: ['setup'],
      steps: [{ name: 'Build frontend', run: 'npm run build' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'test-auth',
      name: 'test:auth-service',
      dependencies: ['build-auth'],
      steps: [{ name: 'Test auth service', run: 'npm test' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'test-api',
      name: 'test:api-service',
      dependencies: ['build-api'],
      steps: [{ name: 'Test API service', run: 'npm test' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'test-frontend',
      name: 'test:frontend',
      dependencies: ['build-frontend'],
      steps: [{ name: 'Test frontend', run: 'npm test' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'integration',
      name: 'integration-tests',
      dependencies: ['test-auth', 'test-api', 'test-frontend'],
      steps: [{ name: 'Integration tests', run: 'npm run test:integration' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'security',
      name: 'security-scan',
      dependencies: ['integration'],
      steps: [{ name: 'Security scan', run: 'trivy scan' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'deploy-staging',
      name: 'deploy:staging',
      dependencies: ['security'],
      steps: [{ name: 'Deploy to staging', run: 'deploy.sh staging' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'e2e',
      name: 'e2e-tests',
      dependencies: ['deploy-staging'],
      steps: [{ name: 'E2E tests', run: 'npm run test:e2e' }],
      environment: {},
      runsOn: 'ubuntu-latest',
    },
    {
      id: 'deploy-prod',
      name: 'deploy:production',
      dependencies: ['e2e'],
      steps: [{ name: 'Deploy to production', run: 'deploy.sh production' }],
      environment: {},
      runsOn: 'ubuntu-latest',
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

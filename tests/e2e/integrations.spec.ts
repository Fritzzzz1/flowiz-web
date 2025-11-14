import { test, expect } from '@playwright/test';

test.describe('Integrations Page', () => {
  test('should display integration options', async ({ page }) => {
    await page.goto('/integrations');

    // Check for page heading
    await expect(page.getByRole('heading', { name: /Integrations/i })).toBeVisible();

    // Check for GitHub integration card
    await expect(page.getByText(/GitHub/i)).toBeVisible();
    await expect(page.getByText(/Connect your GitHub account/i)).toBeVisible();

    // Check for GitLab integration card
    await expect(page.getByText(/GitLab/i)).toBeVisible();
    await expect(page.getByText(/Connect your GitLab account/i)).toBeVisible();
  });

  test('should show connect buttons', async ({ page }) => {
    await page.goto('/integrations');

    // Check for connect buttons (currently disabled in mockup)
    const githubButton = page.getByRole('button', { name: /Connect GitHub/i });
    const gitlabButton = page.getByRole('button', { name: /Connect GitLab/i });

    await expect(githubButton).toBeVisible();
    await expect(gitlabButton).toBeVisible();
  });

  test('should display feature lists', async ({ page }) => {
    await page.goto('/integrations');

    // Check for feature descriptions
    await expect(page.getByText(/Browse repositories/i)).toBeVisible();
    await expect(page.getByText(/View pipeline history/i)).toBeVisible();
    await expect(page.getByText(/Real-time status/i)).toBeVisible();
  });
});

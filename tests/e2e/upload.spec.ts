import { test, expect } from '@playwright/test';

test.describe('Upload Page', () => {
  test('should display upload form', async ({ page }) => {
    await page.goto('/upload');

    // Check for platform selector
    await expect(page.getByText(/Select Platform/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /GitHub Actions/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /GitLab CI/i })).toBeVisible();

    // Check for file upload or text editor
    await expect(page.getByText(/Upload YAML File/i)).toBeVisible();
  });

  test('should select platform', async ({ page }) => {
    await page.goto('/upload');

    // Select GitHub Actions
    const githubButton = page.getByRole('button', { name: /GitHub Actions/i });
    await githubButton.click();

    // Button should show selected state
    await expect(githubButton).toHaveClass(/bg-primary|border-primary/);
  });

  test('should allow pasting YAML content', async ({ page }) => {
    await page.goto('/upload');

    // Select platform
    await page.getByRole('button', { name: /GitHub Actions/i }).click();

    // Find the textarea
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();

    // Paste sample YAML
    const sampleYaml = `name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test`;

    await textarea.fill(sampleYaml);

    // Verify content was added
    await expect(textarea).toHaveValue(/name: CI/);
  });

  test('should have parse button', async ({ page }) => {
    await page.goto('/upload');

    // Parse button should be visible
    const parseButton = page.getByRole('button', { name: /Parse/i });
    await expect(parseButton).toBeVisible();
  });
});

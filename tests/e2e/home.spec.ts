import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the hero section', async ({ page }) => {
    await page.goto('/');

    // Check for hero heading
    await expect(page.getByRole('heading', { name: /FloWiz/i })).toBeVisible();
    await expect(page.getByText(/Visualize your CI\/CD pipelines/i)).toBeVisible();

    // Check for CTA buttons
    const uploadButton = page.getByRole('link', { name: /Get Started/i });
    await expect(uploadButton).toBeVisible();
  });

  test('should navigate to upload page', async ({ page }) => {
    await page.goto('/');

    // Click on Get Started button
    await page.getByRole('link', { name: /Get Started/i }).first().click();

    // Should navigate to upload page
    await expect(page).toHaveURL('/upload');
    await expect(page.getByRole('heading', { name: /Upload/i })).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');

    // Check for feature cards
    await expect(page.getByText(/Interactive Visualizations/i)).toBeVisible();
    await expect(page.getByText(/Real-time Updates/i)).toBeVisible();
    await expect(page.getByText(/Analytics Dashboard/i)).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Test navigation links
    await page.getByRole('link', { name: /Upload/i }).first().click();
    await expect(page).toHaveURL('/upload');

    await page.getByRole('link', { name: /Dashboard/i }).click();
    await expect(page).toHaveURL('/dashboard');

    await page.getByRole('link', { name: /Integrations/i }).click();
    await expect(page).toHaveURL('/integrations');

    // Return to home
    await page.getByRole('link', { name: /FloWiz/i }).first().click();
    await expect(page).toHaveURL('/');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/');

    // Get the html element to check theme class
    const html = page.locator('html');

    // Check initial theme (could be light or dark based on system preference)
    const initialTheme = await html.getAttribute('class');

    // Find and click theme toggle button (moon or sun icon)
    const themeToggle = page.getByRole('button', { name: /theme/i });
    await themeToggle.click();

    // Theme should have changed
    const newTheme = await html.getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);

    // Click again to toggle back
    await themeToggle.click();
    const finalTheme = await html.getAttribute('class');
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference across page navigations', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');

    // Set to dark mode
    const initialClass = await html.getAttribute('class');
    const themeToggle = page.getByRole('button', { name: /theme/i });

    // Ensure we're in dark mode
    if (!initialClass?.includes('dark')) {
      await themeToggle.click();
    }

    // Navigate to another page
    await page.getByRole('link', { name: /Upload/i }).first().click();
    await expect(page).toHaveURL('/upload');

    // Theme should still be dark
    const themeAfterNav = await html.getAttribute('class');
    expect(themeAfterNav).toContain('dark');
  });
});

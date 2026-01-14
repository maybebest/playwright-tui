import { expect, Locator, Page } from "@playwright/test";

/**
 * Options for safe click operation
 */
export interface SafeClickOptions {
  timeout?: number;
}

/**
 * Safely clicks an element, ensuring it's visible first
 * Handles hidden duplicates in the DOM by scrolling and waiting for visibility
 */
export async function safeClick(locator: Locator, options?: SafeClickOptions): Promise<void> {
  // First ensure we're pointing at a visible element; pages often keep hidden duplicates in the DOM.
  try {
    await locator.scrollIntoViewIfNeeded({ timeout: 2_000 });
  } catch (error) {
    // Element might already be in view or DOM, continue with visibility check
    // Log for debugging but don't fail here - the visibility check below will catch real issues
    console.debug(`[safeClick] scrollIntoViewIfNeeded failed (element may already be visible):`, error instanceof Error ? error.message : String(error));
  }

  await expect(locator).toBeVisible({ timeout: options?.timeout });
  await locator.click();
}

/**
 * Attempts to accept cookies if a cookie banner is present
 * Tries multiple common cookie acceptance patterns
 */
export async function maybeAcceptCookies(page: Page): Promise<void> {
  try {
    const accept = page.getByRole("button", { name: /accepteer cookies|accept cookies/i });
    const isVisible = await accept.isVisible({ timeout: 1000 });
    if (isVisible) {
      await accept.click();
      return;
    }
  } catch (error) {
    // Primary button not found, try fallback
    console.debug(`[maybeAcceptCookies] Primary cookie button not found:`, error instanceof Error ? error.message : String(error));
  }

  try {
    // fallback: some consent managers use different labels
    const alt = page.getByRole("button", { name: /akkoord|toestaan|accept all/i });
    const isVisible = await alt.isVisible({ timeout: 1000 });
    if (isVisible) {
      await alt.click();
    }
  } catch (error) {
    // No cookie banner found - this is expected for some pages
    console.debug(`[maybeAcceptCookies] No cookie banner found:`, error instanceof Error ? error.message : String(error));
  }
}

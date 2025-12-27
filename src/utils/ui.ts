import { expect, Locator, Page } from "@playwright/test";

export async function safeClick(locator: Locator, options?: { timeout?: number }) {
  // First ensure we're pointing at a visible element; pages often keep hidden duplicates in the DOM.
  await locator.scrollIntoViewIfNeeded({ timeout: 2_000 }).catch(() => {});

  await expect(locator).toBeVisible({ timeout: options?.timeout });
  // Best-effort scroll: scrolling hidden/animating elements can hang.
  await locator.click();
}

export async function maybeAcceptCookies(page: Page) {
  const accept = page.getByRole("button", { name: /accepteer cookies|accept cookies/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  } else {
    // fallback: some consent managers use different labels
    const alt = page.getByRole("button", { name: /akkoord|toestaan|accept all/i });
    if (await alt.isVisible().catch(() => false)) await alt.click();
  }
}

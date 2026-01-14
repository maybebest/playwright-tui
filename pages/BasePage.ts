import { Page, Locator } from "@playwright/test";

/**
 * BasePage provides common functionality for all page objects.
 * Reduces code duplication and provides consistent behavior across pages.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigate to a URL
   */
  protected async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  /**
   * Get text content from a locator (returns empty string instead of null)
   */
  protected async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? "";
  }

  /**
   * Get attribute value from a locator (returns empty string instead of null)
   */
  protected async getAttribute(locator: Locator, name: string): Promise<string> {
    return (await locator.getAttribute(name)) ?? "";
  }

  /**
   * Get count of matching elements
   */
  protected async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Check if element is visible
   */
  protected async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Wait for element to be visible
   */
  protected async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Wait for element to be hidden
   */
  protected async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout });
  }

  /**
   * Get current page URL
   */
  protected getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  protected async getTitle(): Promise<string> {
    return await this.page.title();
  }
}

import { expect, Locator, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";

export class ResultsPage {
  constructor(private page: Page) {}

  private get resultsList() {
    return this.page.locator('[data-test-id="search-results-list"]');
  }

  private hotelName(parent: Page | Locator = this.page) {
    return parent.locator('[data-test-id="hotel-name"]');
  }
  private continueButton(parent: Page | Locator = this.page) {
    return parent.locator('div.ResultsListItem__continue button[data-test-id="continue-button"]:visible');
  }
  async openFirstAvailableHotel() {
    await expect(this.resultsList).toBeVisible({ timeout: 20_000 });

    const firstResult = this.resultsList.locator('[data-test-id="result-item"]').first();
    await expect(firstResult).toBeVisible();

    // Extract hotel name from the first result item
    const hotelName = await this.hotelName(firstResult).textContent().catch(() => "Unknown Hotel");

    // There can be multiple identical continue buttons in the DOM; pick the visible one to satisfy strict mode.
    const continueBtn = this.continueButton(firstResult);
    await safeClick(continueBtn);
    console.log(`[BOOKING] Hotel Selected: ${hotelName?.trim() || "Unknown Hotel"}`);
  }
}

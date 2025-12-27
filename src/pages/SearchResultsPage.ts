import { expect, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";

export class ResultsPage {
  constructor(private page: Page) {}

  private get resultsList() {
    return this.page.locator('[data-test-id="search-results-list"]');
  }

  async openFirstAvailableHotel() {
    await expect(this.resultsList).toBeVisible({ timeout: 20_000 });

    const firstResult = this.resultsList.locator('[data-test-id="result-item"]').first();
    await expect(firstResult).toBeVisible();

    // There can be multiple identical continue buttons in the DOM; pick the visible one to satisfy strict mode.
    const continueBtn = firstResult.locator('div.ResultsListItem__continue button[data-test-id="continue-button"]:visible');
    await safeClick(continueBtn);
  }
}

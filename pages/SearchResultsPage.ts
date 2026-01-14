import { Locator, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";
import { BasePage } from "./BasePage";

export class ResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ==================== Locators ====================
  
  public get resultsList(): Locator {
    return this.page.locator('[data-test-id="search-results-list"]');
  }

  /**
   * Get the first search result item
   * @returns Locator for the first result
   */
  public getFirstResult(): Locator {
    return this.resultsList.locator('[data-test-id="result-item"]').first();
  }

  // ==================== Public Methods ====================
  
  /**
   * Open the first available hotel from search results
   * @returns The name of the selected hotel
   */
  public async openFirstAvailableHotel(): Promise<string> {
    const firstResult = this.getFirstResult();

    // Extract hotel name from the first result item
    const hotelNameElement = firstResult.locator('[data-test-id="hotel-name"]');
    const hotelName = await this.getText(hotelNameElement);

    // There can be multiple identical continue buttons in the DOM; pick the visible one to satisfy strict mode.
    const continueBtn = firstResult.locator('div.ResultsListItem__continue button[data-test-id="continue-button"]:visible');
    await safeClick(continueBtn);
    
    const trimmedName = hotelName.trim();
    console.log(`[BOOKING] Hotel Selected: ${trimmedName}`);
    return trimmedName;
  }
}

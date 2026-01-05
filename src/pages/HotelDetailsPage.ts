import { expect, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";

export class HotelDetailsPage {
  constructor(private page: Page) {}

  private get overviewContainer() {
    return this.page.locator("#headerContainer__component");
  }
  private get continueButton() {
    return this.page.locator(".ProgressbarNavigation__summaryButton");
  }

  async continueFromHotelDetails() {
    await expect(this.overviewContainer).toBeVisible({ timeout: 40_000 });
    
    await safeClick(this.continueButton);
  }
}

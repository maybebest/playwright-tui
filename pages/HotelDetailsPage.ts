import { Locator, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";
import { BasePage } from "./BasePage";

export class HotelDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ==================== Locators ====================
  
  public get overviewContainer(): Locator {
    return this.page.locator("#headerContainer__component");
  }
  
  private get continueButton(): Locator {
    return this.page.locator(".ProgressbarNavigation__summaryButton");
  }

  // ==================== Public Methods ====================
  
  /**
   * Continue from hotel details to next step
   */
  public async continueFromHotelDetails(): Promise<void> {
    await safeClick(this.continueButton);
  }
}

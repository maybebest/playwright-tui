import { Locator, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";
import { BasePage } from "./BasePage";

export class FlightsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ==================== Locators ====================
  
  public get summaryContainer(): Locator {
    return this.page.locator(".ContainerWithRiteSideHolidaySummary");
  }
  
  private get continueButton(): Locator {
    return this.page.locator(".ProgressbarNavigation__container .ProgressbarNavigation__summaryButton:visible");
  }

  // ==================== Public Methods ====================
  
  /**
   * Select available flights and continue to next step
   */
  public async selectAvailableFlightsAndContinue(): Promise<void> {
    await safeClick(this.continueButton);
  }
}

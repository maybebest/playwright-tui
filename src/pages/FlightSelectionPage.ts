import { expect, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";

export class FlightsPage {
  constructor(private page: Page) {}

  private get summaryContainer() {
    return this.page.locator(".ContainerWithRiteSideHolidaySummary");
  }
  private get continueButton() {
    return this.page.locator(".ProgressbarNavigation__container .ProgressbarNavigation__summaryButton:visible");
  }

  async selectAvailableFlightsAndContinue() {
    await expect(this.summaryContainer).toBeVisible({ timeout: 40_000 });
    await safeClick(this.continueButton, { timeout: 20_000 });
  }
}

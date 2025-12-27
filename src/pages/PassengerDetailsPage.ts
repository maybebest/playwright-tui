import { expect, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";

export const passengerValidationIdsBySection = {
  adult_mainBooker: [
    "FIRSTNAMEADULT",
    "SURNAMEADULT",
    "ADDRESS1ADULT",
    "HOUSENUMBERADULT",
    "POSTALCODEADULT",
    "TOWNADULT",
    "MOBILENUMBERADULT",
    "EMAILADDRESSADULT",
  ],
  child_passenger: ["FIRSTNAMECHILD", "SURNAMECHILD"],
  infant_passenger: ["FIRSTNAMEINFANT", "SURNAMEINFANT"],
} as const;

export class PassengerDetailsPage {
  constructor(private page: Page) {}

  private get paxForm() {
    return this.page.locator("#pax-form");
  }
  private get continueButton() {
    return this.page.locator("#PassengerV2ContinueButton__component .ContinueButtonV2__continue:visible button");
  }
  private get firstNameInfantInputs() {
    return this.page.locator('[id^="FIRSTNAMEINFANT"]');
  }
  private get firstNameChildInputs() {
    return this.page.locator('[id^="FIRSTNAMECHILD"]');
  }

  async validatePassengerFieldErrors() {
    await expect(this.paxForm).toBeVisible({ timeout: 40_000 });
    await safeClick(this.continueButton, { timeout: 20_000 });

    // Child passenger ids can vary by flow/age: CHILD vs INFANT.
    const hasInfant = (await this.firstNameInfantInputs.count().catch(() => 0)) > 0;
    const hasChild = (await this.firstNameChildInputs.count().catch(() => 0)) > 0;

    // After clicking continue, verify all validation error messages are visible.
    // Always validate main booker. Then validate either INFANT or CHILD (or both if present).
    const sectionsToValidate: Array<keyof typeof passengerValidationIdsBySection> = ["adult_mainBooker"];
    if (hasInfant) sectionsToValidate.push("infant_passenger");
    if (hasChild) sectionsToValidate.push("child_passenger");

    for (const section of sectionsToValidate) {
      const ids = passengerValidationIdsBySection[section];
      for (const id of ids as readonly string[]) {
        await this.expectValidationErrorForFieldId(id);
      }
    }
  }

  private async expectValidationErrorForFieldId(id: string) {
    // Each input error has a predictable ID: `${inputId}__errorMessage`.
    // Validate that the error element exists and is visible.
    // The page renders validation errors as elements with ids like:
    // - FIRSTNAMEADULT1__errorMessage
    // - FIRSTNAMEADULT3__errorMessage
    // So we assert *all* matching errorMessage nodes for the given prefix are visible.
    const errors = this.errorMessagesByPrefix(id);
    
    try {
      // If the locator matches multiple errors, Playwright's `toBeVisible()` is strict-mode and will fail.
      // Instead, verify we have at least one match, then assert every match is visible.
      await expect.poll(() => errors.count(), { timeout: 15_000 }).toBeGreaterThan(0);
      const n = await errors.count();
      for (let i = 0; i < n; i++) {
        await expect(errors.nth(i)).toBeVisible({ timeout: 15_000 });
      }
    } catch (e) {
      // If errors are not visible yet, click continue again to trigger validation and retry a few times.
      let found = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        await safeClick(this.continueButton, { timeout: 20_000 });
        try {
          await expect.poll(() => errors.count(), { timeout: 15_000 }).toBeGreaterThan(0);
          found = true;
          break;
        } catch {
          // keep retrying
        }
      }

      if (!found) {
        throw new Error(
          `No visible validation errors found for prefix "${id}" after 5 continue clicks`
        );
      }
    }
  }

  private errorMessagesByPrefix(prefix: string) {
    return this.page.locator(`[id^="${prefix}"][id$="__errorMessage"]:visible`);
  }
}
 
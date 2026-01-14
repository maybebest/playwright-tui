import { Locator, Page } from "@playwright/test";
import { safeClick } from "../utils/ui";
import { BasePage } from "./BasePage";
import type { PassengerSectionType, PassengerValidationIds } from "../types/page-objects.types";

export const passengerValidationIdsBySection: PassengerValidationIds = {
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

export type { PassengerSectionType };

export class PassengerDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ==================== Locators ====================
  
  public get paxForm(): Locator {
    return this.page.locator("#pax-form");
  }
  
  public get continueButton(): Locator {
    return this.page.locator("#PassengerV2ContinueButton__component .ContinueButtonV2__continue:visible button");
  }
  
  public get firstNameInfantInputs(): Locator {
    return this.page.locator('[id^="FIRSTNAMEINFANT"]');
  }
  
  public get firstNameChildInputs(): Locator {
    return this.page.locator('[id^="FIRSTNAMECHILD"]');
  }

  // ==================== Public Methods ====================
  
  /**
   * Click the continue button to trigger validation
   */
  public async clickContinue(): Promise<void> {
    // Click without waiting - validation happens client-side immediately
    await safeClick(this.continueButton);
  }
  
  /**
   * Wait for validation to be triggered (any error message appears)
   * This ensures validation has been processed before we check individual fields
   * @param timeout - Maximum time to wait for validation in milliseconds (default 3s for fail-fast)
   * @returns true if validation errors appeared, false otherwise
   */
  public async waitForValidationTriggered(timeout: number = 3000): Promise<boolean> {
    try {
      // Wait for ANY error message to appear on the page
      const anyError = this.page.locator('[id$="__errorMessage"]:visible').first();
      await anyError.waitFor({ state: "visible", timeout });
      return true;
    } catch {
      // No validation errors appeared - form might have submitted or validation failed to trigger
      return false;
    }
  }

  /**
   * Determine which passenger sections need validation based on form inputs
   * @returns Array of passenger section types to validate
   */
  public async getSectionsToValidate(): Promise<PassengerSectionType[]> {
    // Child passenger ids can vary by flow/age: CHILD vs INFANT.
    const hasInfant = (await this.getCount(this.firstNameInfantInputs)) > 0;
    const hasChild = (await this.getCount(this.firstNameChildInputs)) > 0;

    // Always validate main booker. Then validate either INFANT or CHILD (or both if present).
    const sectionsToValidate: PassengerSectionType[] = ["adult_mainBooker"];
    if (hasInfant) sectionsToValidate.push("infant_passenger");
    if (hasChild) sectionsToValidate.push("child_passenger");
    
    return sectionsToValidate;
  }

  /**
   * Get error message locators for fields with a specific prefix
   * @param prefix - The field ID prefix to search for
   * @returns Locator for matching error messages
   */
  public getErrorMessagesByPrefix(prefix: string): Locator {
    // Try multiple possible error message patterns
    // Pattern 1: {FIELDID}__errorMessage (most common)
    // Pattern 2: {FIELDID}_error
    // Pattern 3: Any visible error near the field
    return this.page.locator(`[id^="${prefix}"][id$="__errorMessage"]:visible, [id^="${prefix}"][id$="_error"]:visible`);
  }

  /**
   * Get error message locators for a specific field ID
   * @param id - The field ID to get error messages for
   * @returns Locator for error messages
   */
  public getErrorMessagesForFieldId(id: string): Locator {
    // Return error locator directly - no retry loop that masks real issues
    // Test will fail fast if validation errors don't appear
    return this.getErrorMessagesByPrefix(id);
  }
  
  /**
   * Check if a specific field has validation errors
   * Returns immediately - no waiting
   * @param id - The field ID to check
   * @returns true if field has validation errors, false otherwise
   */
  public async hasErrorForField(id: string): Promise<boolean> {
    const errors = await this.getErrorMessagesForFieldId(id);
    const count = await errors.count();
    return count > 0;
  }
}
 
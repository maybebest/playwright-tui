import { Page, Locator } from "@playwright/test";
import { SeededRandom } from "../utils/random";
import { maybeAcceptCookies, safeClick } from "../utils/ui";
import { BasePage } from "./BasePage";
import { TEST_CONFIG } from "../config/test.config";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ==================== Locators ====================
  // Centralized via getters with explicit return types for better type safety
  
  // Airport Selection Locators
  private get airportInput(): Locator {
    return this.page.locator('[data-test-id="airport-input"]');
  }
  
  public get airportsPanel(): Locator {
    return this.page.locator(".dropModalScope_airports");
  }
  
  private get airportBoxes(): Locator {
    return this.airportsPanel.locator(".SelectAirports__parentGroup .inputs__CheckboxTextAligned");
  }
  
  private get airportsApply(): Locator {
    return this.airportsPanel.locator(".DropModal__footerContainer .DropModal__apply");
  }

  // Destination Selection Locators
  private get destinationOpen(): Locator {
    return this.page.locator(".Package__destinations .inputs__children:visible");
  }
  
  public get destinationPanel(): Locator {
    return this.page.locator(".dropModalScope_destinations");
  }
  
  public get destinationLinks(): Locator {
    return this.destinationPanel.locator(".DestinationsList__link:not(.DestinationsList__disabled)");
  }
  
  private get destinationParentCheckbox(): Locator {
    return this.destinationPanel.locator(
      ".DestinationsList__droplistContainer .DestinationsList__parentCheckbox:visible"
    );
  }
  
  private get destinationApply(): Locator {
    return this.destinationPanel.locator(".DropModal__footerContainer .DropModal__apply");
  }

  // Departure Date Locators
  private get departureDateInput(): Locator {
    return this.page.locator('[data-test-id="departure-date-input"]');
  }
  
  public get departureDatePanel(): Locator {
    return this.page.locator(".dropModalScope_Departuredate");
  }
  
  public get availableDepartureDates(): Locator {
    return this.departureDatePanel.locator(".SelectLegacyDate__available");
  }
  
  private get departureDateApply(): Locator {
    return this.departureDatePanel.locator(".DropModal__footerContainer .DropModal__apply");
  }

  // Rooms and Guests Locators
  private get roomsGuestsInput(): Locator {
    return this.page.locator('[data-test-id="rooms-and-guest-input"]');
  }
  
  private get adultsSelect(): Locator {
    return this.page.locator(".AdultSelector__adultSelector select");
  }
  
  private get childrenSelect(): Locator {
    return this.page.locator(".ChildrenSelector__childrenSelector select");
  }
  
  public get childAgeSelect(): Locator {
    return this.page.locator(".ChildrenAge__childAgeSelector select");
  }
  
  private get guestsPanel(): Locator {
    return this.page.locator(".dropModalScope_roomandguest");
  }
  
  private get guestsApply(): Locator {
    return this.guestsPanel.locator(".DropModal__footerContainer .DropModal__apply");
  }

  // Search Controls
  private get searchButton(): Locator {
    return this.page.locator('[data-test-id="search-button"]');
  }
  
  public get searchResultsList(): Locator {
    return this.page.locator('[data-test-id="search-results-list"]');
  }

  // ==================== Public Methods ====================

  /**
   * Navigate to the home page and handle cookie consent
   */
  public async open(): Promise<void> {
    await this.goto(TEST_CONFIG.baseUrl);
    await maybeAcceptCookies(this.page);
  }

  /**
   * Select a random departure airport from available options
   * @returns The selected airport name
   */
  public async selectRandomDepartureAirport(): Promise<string> {
    await safeClick(this.airportInput);
    const selectedBox = this.airportBoxes.first();
    const airportText = await this.getText(selectedBox);
    await safeClick(selectedBox);
    await safeClick(this.airportsApply);
    const trimmedAirport = airportText.trim();
    console.log(`[BOOKING] Departure Airport: ${trimmedAirport}`);
    return trimmedAirport;
  }

  /**
   * Select a random destination from available options
   * @param rng - Seeded random number generator for reproducibility
   * @returns The selected destination name
   */
  public async selectRandomDestinationAirport(rng: SeededRandom): Promise<string> {
    await safeClick(this.destinationOpen);
    const count = await this.getCount(this.destinationLinks);
    const picked = this.destinationLinks.nth(rng.pickIndex(count));
    const destinationText = await this.getText(picked);
    await safeClick(picked);

    await safeClick(this.destinationParentCheckbox);
    await safeClick(this.destinationApply);
    const trimmedDestination = destinationText.trim();
    console.log(`[BOOKING] Destination: ${trimmedDestination}`);
    return trimmedDestination;
  }

  /**
   * Select a random available departure date
   * @param rng - Seeded random number generator for reproducibility
   * @returns The selected departure date
   */
  public async selectFirstAvailableDepartureDate(rng: SeededRandom): Promise<string> {
    await safeClick(this.departureDateInput);
    const dateCount = await this.getCount(this.availableDepartureDates);
    const picked = this.availableDepartureDates.nth(rng.pickIndex(dateCount));
    const ariaLabel = await this.getAttribute(picked, "aria-label");
    const dateLabel = ariaLabel || await this.getText(picked);
    await safeClick(picked);
    await safeClick(this.departureDateApply);
    const trimmedDate = dateLabel.trim();
    console.log(`[BOOKING] Departure Date: ${trimmedDate}`);
    return trimmedDate;
  }

  /**
   * Configure room guests: 2 adults and 1 child with random age
   * @param rng - Seeded random number generator for reproducibility
   * @returns The selected child age
   */
  public async setRoomsGuestsTo2Adults1ChildRandomAge(rng: SeededRandom): Promise<number> {
    await safeClick(this.roomsGuestsInput);

    await this.adultsSelect.selectOption("2");
    await this.childrenSelect.selectOption("1");

    const ageOptions = this.childAgeSelect.locator("option:not([disabled])");
    const count = await this.getCount(ageOptions);
    const validValues: string[] = [];
    for (let i = 0; i < count; i++) {
      const opt = ageOptions.nth(i);
      const value = await this.getAttribute(opt, "value");
      if (!value) continue;
      const n = Number(value);
      if (n >= 0) validValues.push(value);
    }
    if (validValues.length === 0) {
      throw new Error("No valid child age options (value >= 0) found");
    }
    const selectedAge = validValues[rng.pickIndex(validValues.length)];
    await this.childAgeSelect.selectOption(selectedAge);
    await safeClick(this.guestsApply);
    const childAge = Number(selectedAge);
    console.log(`[BOOKING] Guests: 2 Adults, 1 Child (age ${childAge})`);
    return childAge;
  }

  /**
   * Submit the holiday search form
   */
  public async searchHolidays(): Promise<void> {
    await safeClick(this.searchButton);
  }
}

import { expect, Page } from "@playwright/test";
import { SeededRandom } from "../utils/random";
import { maybeAcceptCookies, safeClick } from "../utils/ui";

export class HomePage {
  constructor(private page: Page) {}

  // Locators (centralized via getters, no field declarations needed)
  private get airportInput() {
    return this.page.locator('[data-test-id="airport-input"]');
  }
  private get airportsPanel() {
    return this.page.locator(".dropModalScope_airports");
  }
  private get airportBoxes() {
    return this.airportsPanel.locator(".SelectAirports__parentGroup .inputs__box");
  }
  private get airportsApply() {
    return this.airportsPanel.locator(".DropModal__footerContainer .DropModal__apply");
  }

  private get destinationOpen() {
    return this.page.locator(".Package__destinations .inputs__children:visible");
  }
  private get destinationPanel() {
    return this.page.locator(".dropModalScope_destinations");
  }
  private get destinationLinks() {
    return this.destinationPanel.locator(".DestinationsList__link:not(.DestinationsList__disabled)");
  }
  private get destinationParentCheckbox() {
    return this.destinationPanel.locator(
      ".DestinationsList__droplistContainer .DestinationsList__parentCheckbox:visible"
    );
  }
  private get destinationApply() {
    return this.destinationPanel.locator(".DropModal__footerContainer .DropModal__apply");
  }

  private get departureDateInput() {
    return this.page.locator('[data-test-id="departure-date-input"]');
  }
  private get departureDatePanel() {
    return this.page.locator(".dropModalScope_Departuredate");
  }
  private get availableDepartureDates() {
    return this.departureDatePanel.locator(".SelectLegacyDate__available");
  }
  private get departureDateApply() {
    return this.departureDatePanel.locator(".DropModal__footerContainer .DropModal__apply");
  }

  private get roomsGuestsInput() {
    return this.page.locator('[data-test-id="rooms-and-guest-input"]');
  }
  private get adultsSelect() {
    return this.page.locator(".AdultSelector__adultSelector select");
  }
  private get childrenSelect() {
    return this.page.locator(".ChildrenSelector__childrenSelector select");
  }
  private get childAgeSelect() {
    return this.page.locator(".ChildrenAge__childAgeSelector select");
  }
  private get guestsPanel() {
    return this.page.locator(".dropModalScope_roomandguest");
  }
  private get guestsApply() {
    return this.guestsPanel.locator(".DropModal__footerContainer .DropModal__apply");
  }

  private get searchButton() {
    return this.page.locator('[data-test-id="search-button"]');
  }
  private get searchResultsList() {
    return this.page.locator('[data-test-id="search-results-list"]');
  }

  async open() {
    await this.page.goto("https://www.tui.nl/h/nl", { waitUntil: "domcontentloaded" });
    await maybeAcceptCookies(this.page);
  }

  async selectRandomDepartureAirport() {
    await safeClick(this.airportInput);
    await expect(this.airportsPanel).toBeVisible();
    await safeClick(this.airportBoxes);
    await safeClick(this.airportsApply);
  }

  async selectRandomDestinationAirport(rng: SeededRandom) {
    await safeClick(this.destinationOpen);
    await expect(this.destinationPanel).toBeVisible({ timeout: 20_000 });

    await expect.poll(() => this.destinationLinks.count(), { timeout: 20_000 }).toBeGreaterThan(0);
    const count = await this.destinationLinks.count();
    const picked = this.destinationLinks.nth(rng.pickIndex(count));
    await safeClick(picked);

    await safeClick(this.destinationParentCheckbox);
    await safeClick(this.destinationApply);
  }

  async selectFirstAvailableDepartureDate(rng: SeededRandom) {
    await safeClick(this.departureDateInput);
    await expect(this.departureDatePanel).toBeVisible();
    await expect.poll(() => this.availableDepartureDates.count(), { timeout: 15_000 }).toBeGreaterThan(0);
    const dateCount = await this.availableDepartureDates.count();
    const picked = this.availableDepartureDates.nth(rng.pickIndex(dateCount));
    await safeClick(picked);
    await safeClick(this.departureDateApply);
  }

  async setRoomsGuestsTo2Adults1ChildRandomAge(rng: SeededRandom) {
    await safeClick(this.roomsGuestsInput);

    await this.adultsSelect.selectOption("2");
    await this.childrenSelect.selectOption("1");

    await expect(this.childAgeSelect).toBeVisible();
    const ageOptions = this.childAgeSelect.locator("option:not([disabled])");
    const count = await ageOptions.count();
    const validValues: string[] = [];
    for (let i = 0; i < count; i++) {
      const opt = ageOptions.nth(i);
      const value = (await opt.getAttribute("value").catch(() => null)) ?? "";
      if (!value) continue;
      const n = Number(value);
      if (Number.isFinite(n) && n >= 0) validValues.push(value);
    }
    if (validValues.length === 0) throw new Error("No valid child age options (value >= 0) found");
    await this.childAgeSelect.selectOption(validValues[rng.pickIndex(validValues.length)]);
    await safeClick(this.guestsApply);
  }

  async searchHolidays() {
    await safeClick(this.searchButton);
    await expect(this.searchResultsList).toBeVisible({ timeout: 20_000 });
  }
}

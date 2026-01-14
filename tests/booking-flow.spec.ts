import { test, expect } from "../fixtures/pages.fixture";
import { SeededRandom } from "../utils/random";
import { passengerValidationIdsBySection } from "../pages/PassengerDetailsPage";
import { getDefaultScenario } from "../test-data/test-data.loader";
import { ENV } from "../config/test.config";

test("TUI holiday booking journey + passenger validation checks", async ({
  homePage,
  resultsPage,
  hotelDetailsPage,
  flightsPage,
  passengerDetailsPage,
}, testInfo) => {
  // Load test data from centralized location
  const scenario = getDefaultScenario();
  
  const seed = ENV.seed + testInfo.workerIndex;
  const rng = new SeededRandom(seed);
  testInfo.annotations.push({ type: "seed", description: String(seed) });
  testInfo.annotations.push({ type: "scenario", description: scenario.name });

  await test.step("1-2. Open homepage + accept cookies", async () => {
    await homePage.open();
  });

  await test.step("3. Select random available departure airport", async () => {
    await expect(homePage.airportsPanel).toBeVisible();
    await homePage.selectRandomDepartureAirport();
  });

  await test.step("4. Select random destination", async () => {
    await expect(homePage.destinationPanel).toBeVisible();
    await expect.poll(() => homePage.destinationLinks.count()).toBeGreaterThan(0);
    await homePage.selectRandomDestinationAirport(rng);
  });

  await test.step("5. Select an available departure date", async () => {
    await expect(homePage.departureDatePanel).toBeVisible();
    await expect.poll(() => homePage.availableDepartureDates.count()).toBeGreaterThan(0);
    await homePage.selectFirstAvailableDepartureDate(rng);
  });

  await test.step(`6. Rooms & Guests: ${scenario.adults} adults + ${scenario.children} child with random age`, async () => {
    await expect(homePage.childAgeSelect).toBeVisible();
    // Using scenario data - currently using the default scenario (2 adults, 1 child)
    // Can be extended to support different scenarios
    await homePage.setRoomsGuestsTo2Adults1ChildRandomAge(rng);
  });

  await test.step("7. Search for holidays", async () => {
    await homePage.searchHolidays();
    await expect(homePage.searchResultsList).toBeVisible();
  });

  await test.step("8. Pick first available hotel from results", async () => {
    await expect(resultsPage.resultsList).toBeVisible();
    const firstResult = resultsPage.getFirstResult();
    await expect(firstResult).toBeVisible();
    await resultsPage.openFirstAvailableHotel();
  });

  await test.step("9. Hotel details: click Continue", async () => {
    await expect(hotelDetailsPage.overviewContainer).toBeVisible();
    await hotelDetailsPage.continueFromHotelDetails();
  });

  await test.step("10-11. Select available flights and continue to passenger details", async () => {
    await expect(flightsPage.summaryContainer).toBeVisible();
    await flightsPage.selectAvailableFlightsAndContinue();
  });

  await test.step("12. Validate error messages in passenger fields", async () => {
    // Assert form is visible
    await expect(passengerDetailsPage.paxForm).toBeVisible();
    
    // Click continue to trigger validation errors
    await passengerDetailsPage.clickContinue();

    // Wait for validation to be triggered (fail fast if it doesn't happen)
    const validationTriggered = await passengerDetailsPage.waitForValidationTriggered(3000);
    
    if (!validationTriggered) {
      throw new Error(
        "Validation failed to trigger within 3 seconds. " +
        "Either form submitted unexpectedly or validation is broken. " +
        "Check if continue button behavior changed or if validation is client-side."
      );
    }

    // Determine which sections to validate
    const sectionsToValidate = await passengerDetailsPage.getSectionsToValidate();

    // Validate all error messages for each section
    for (const section of sectionsToValidate) {
      const ids = passengerValidationIdsBySection[section];
      for (const id of ids as readonly string[]) {
        const errors = await passengerDetailsPage.getErrorMessagesForFieldId(id);
        
        // Assert at least one error exists
        await expect.poll(() => errors.count()).toBeGreaterThan(0);
        
        // Assert all matched errors are visible
        const errorCount = await errors.count();
        for (let i = 0; i < errorCount; i++) {
          await expect(errors.nth(i)).toBeVisible();
        }
      }
    }
  });
});

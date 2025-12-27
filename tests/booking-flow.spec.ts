import { test } from "@playwright/test";
import { SeededRandom } from "../src/utils/random";
import { HomePage } from "../src/pages/HomePage";
import { ResultsPage } from "../src/pages/SearchResultsPage";
import { HotelDetailsPage } from "../src/pages/HotelDetailsPage";
import { FlightsPage } from "../src/pages/FlightSelectionPage";
import { PassengerDetailsPage } from "../src/pages/PassengerDetailsPage";

test("TUI holiday booking journey + passenger validation checks", async ({ page }, testInfo) => {
  const seed = Number((globalThis as any).process?.env?.SEED ?? Date.now()) + testInfo.workerIndex;
  const rng = new SeededRandom(seed);
  testInfo.annotations.push({ type: "seed", description: String(seed) });

  const home = new HomePage(page);
  const results = new ResultsPage(page);
  const hotel = new HotelDetailsPage(page);
  const flights = new FlightsPage(page);
  const pax = new PassengerDetailsPage(page);

  await test.step("1-2. Open homepage + accept cookies", async () => {
    await home.open();
  });

  await test.step("3. Select random available departure airport", async () => {
    await home.selectRandomDepartureAirport();
  });

  await test.step("4. Select random destination", async () => {
    await home.selectRandomDestinationAirport(rng);
  });

  await test.step("5. Select an available departure date", async () => {
    await home.selectFirstAvailableDepartureDate(rng);
  });

  await test.step("6. Rooms & Guests: 2 adults + 1 child with random age", async () => {
    await home.setRoomsGuestsTo2Adults1ChildRandomAge(rng);
  });

  await test.step("7. Search for holidays", async () => {
    await home.searchHolidays();
  });

  await test.step("8. Pick first available hotel from results", async () => {
    await results.openFirstAvailableHotel();
  });

  await test.step("9. Hotel details: click Continue", async () => {
    await hotel.continueFromHotelDetails();
  });

  await test.step("10-11. Select available flights and continue to passenger details", async () => {
    await flights.selectAvailableFlightsAndContinue();
  });

  await test.step("12. Validate error messages in passenger fields", async () => {
    await pax.validatePassengerFieldErrors();
  });
});

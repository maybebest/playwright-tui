import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ResultsPage } from "../pages/SearchResultsPage";
import { HotelDetailsPage } from "../pages/HotelDetailsPage";
import { FlightsPage } from "../pages/FlightSelectionPage";
import { PassengerDetailsPage } from "../pages/PassengerDetailsPage";

/**
 * Page object fixtures for test automation
 * Automatically initializes page objects for each test
 */
export type PageFixtures = {
  homePage: HomePage;
  resultsPage: ResultsPage;
  hotelDetailsPage: HotelDetailsPage;
  flightsPage: FlightsPage;
  passengerDetailsPage: PassengerDetailsPage;
};

/**
 * Extended Playwright test with page object fixtures
 */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use): Promise<void> => {
    await use(new HomePage(page));
  },
  resultsPage: async ({ page }, use): Promise<void> => {
    await use(new ResultsPage(page));
  },
  hotelDetailsPage: async ({ page }, use): Promise<void> => {
    await use(new HotelDetailsPage(page));
  },
  flightsPage: async ({ page }, use): Promise<void> => {
    await use(new FlightsPage(page));
  },
  passengerDetailsPage: async ({ page }, use): Promise<void> => {
    await use(new PassengerDetailsPage(page));
  },
});

export { expect } from "@playwright/test";

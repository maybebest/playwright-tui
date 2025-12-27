# TUI.nl Booking Flow Automation

This project contains automated end-to-end tests for the TUI.nl booking flow using Playwright and TypeScript, following the Page Object Model (POM) pattern.

## Project Structure

```
.
├── pages/                      # Page Object Model classes
│   ├── HomePage.ts            # Homepage interactions
│   ├── SearchResultsPage.ts   # Search results page
│   ├── HotelDetailsPage.ts    # Hotel details page
│   ├── FlightSelectionPage.ts # Flight selection page
│   └── PassengerDetailsPage.ts # Passenger details page
├── tests/                      # Test files
│   └── booking-flow.spec.ts   # Main booking flow test
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd "untitled folder"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running the Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see the browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

## Test Scenario

The automated test performs the following steps:

1. **Open Homepage**: Navigates to https://www.tui.nl/h/nl
2. **Accept Cookies**: Handles cookie consent popup
3. **Select Departure Airport**: Randomly selects an available departure airport
4. **Select Destination**: Randomly selects an available destination airport
5. **Select Departure Date**: Chooses an available departure date from the calendar
6. **Configure Rooms & Guests**: Selects 2 adults and 1 child (with random age from available values)
7. **Search for Holidays**: Initiates the search
8. **Select Hotel**: Picks the first available hotel from search results
9. **Continue from Hotel Details**: Clicks continue on the hotel details page
10. **Select Flights**: Chooses available flights
11. **Navigate to Passenger Details**: Continues to the passenger information page
12. **Validate Error Messages**: Tests validation for missing/invalid passenger information

## Features

- **Page Object Model (POM)**: Clean separation of page logic and test code
- **Comprehensive Logging**: All selected test data (airports, dates, hotel, etc.) is logged to console
- **Error Handling**: Robust error handling with fallback strategies
- **Validation Testing**: Validates error messages for form fields
- **TypeScript**: Full type safety and modern JavaScript features
- **Best Practices**: Follows Playwright and testing best practices

## Test Data Logging

The test automatically logs all selected booking data to the console:

- Departure Airport
- Destination Airport
- Departure Date
- Number of Adults
- Child Age (if applicable)
- Hotel Name
- Error Messages (if any)

Example output:
```
========================================
BOOKING TEST DATA SUMMARY
========================================
Departure Airport: Amsterdam Schiphol
Destination Airport: Mallorca
Departure Date: 15-03-2024
Adults: 2
Child Age: 5
Hotel Name: Hotel Example
========================================
```

## Configuration

The Playwright configuration can be modified in `playwright.config.ts`:

- **Base URL**: Set to `https://www.tui.nl`
- **Timeout**: 30 seconds for actions, 60 seconds for navigation
- **Browser**: Configured for Chromium by default
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure

## Troubleshooting

### Tests fail to find elements
- The website structure may have changed. Update selectors in the respective page objects.
- Increase timeout values in `playwright.config.ts` if the site is slow.

### Cookie popup not found
- The test includes fallback logic. If cookies are not accepted, the test will continue.
- Check the console output for warnings.

### No hotels found
- Ensure the search criteria returns results.
- The test includes fallback logic to handle edge cases.

### Browser not installed
- Run `npx playwright install` to install required browsers.

## Best Practices Implemented

1. **Page Object Model**: Each page has its own class with reusable methods
2. **Explicit Waits**: Proper waiting strategies for elements and page loads
3. **Error Handling**: Try-catch blocks with fallback strategies
4. **Logging**: Comprehensive console logging for debugging
5. **Type Safety**: Full TypeScript implementation
6. **Maintainability**: Clean, readable, and well-structured code
7. **Assertions**: Proper validation checks using Playwright's expect API

## Notes

- The test uses multiple selector strategies to handle different website implementations
- Random selection ensures different test runs cover various scenarios
- The test is designed to be resilient to minor UI changes
- All test data is logged for transparency and debugging

## License

ISC





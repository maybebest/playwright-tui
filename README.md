# TUI.nl Booking Flow Automation

This project contains automated end-to-end tests for the TUI.nl booking flow using Playwright and TypeScript, following the Page Object Model (POM) pattern.

## Project Structure

This project follows **Playwright/Node.js test automation conventions** with a flat directory structure. See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed documentation.

```
.
├── .github/workflows/          # CI/CD pipelines
├── config/                     # Centralized configuration
├── fixtures/                   # Playwright test fixtures
├── locators/                   # Centralized UI selectors
├── pages/                      # Page Object Model classes
│   ├── HomePage.ts
│   ├── SearchResultsPage.ts
│   ├── HotelDetailsPage.ts
│   ├── FlightSelectionPage.ts
│   └── PassengerDetailsPage.ts
├── test-data/                  # Test data files (JSON)
├── tests/                      # Test specification files
│   └── booking-flow.spec.ts
├── types/                      # TypeScript type definitions
├── utils/                      # Shared utility functions
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
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

## Configuration

This project uses a centralized configuration system with full environment variable support. See [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) for complete details.

### Quick Start

```bash
# Run tests in development environment (default)
npx playwright test

# Run tests in staging environment
TEST_ENV=staging npx playwright test

# Run tests in production environment
TEST_ENV=production npx playwright test

# Override base URL
BASE_URL=https://custom.tui.nl/h/nl npx playwright test
```

### Using Environment Files

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your preferences
# Then run tests (auto-loads .env.local)
npx playwright test
```

### Available Environment Variables

- `TEST_ENV` - Environment selection (dev/staging/production)
- `BASE_URL` - Override base URL
- `HEADLESS` - Run browser in headless mode
- `DEBUG` - Enable debug mode
- `SEED` - Random seed for reproducible tests
- Many more - see [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)

## Running the Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see the browser)
```bash
npm run test:headed
# or
HEADLESS=false npx playwright test
```

### Run tests in debug mode
```bash
npm run test:debug
# or
DEBUG=true HEADLESS=false npx playwright test
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

- **Proper Page Object Model (POM)**: Page objects contain NO assertions - only actions and locators
- **Flat Project Structure**: Follows Playwright/Node.js conventions (NOT Java/Spring Boot `src/` pattern)
- **Fixtures**: Automatic page object initialization with Playwright fixtures
- **Environment Configuration**: Full environment variable support, no hardcoded values
- **Multi-Environment Support**: Easy switching between dev, staging, production
- **Centralized Configuration**: All settings in `config/` directory
- **Test Data Management**: JSON-based test data with type-safe loaders
- **Locator Management**: Centralized selectors in `locators/`
- **Type Safety**: Full TypeScript with custom type definitions
- **CI/CD Ready**: GitHub Actions workflow for automated testing
- **Comprehensive Logging**: All selected test data logged to console
- **Error Handling**: Robust error handling with retry strategies
- **Validation Testing**: Comprehensive form validation checks
- **Reproducible Tests**: Seed-based randomization for debugging

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

## Advanced Configuration

All configuration is centralized and environment-variable driven:

### Configuration Files
- `config/environment.config.ts` - Environment-specific settings
- `config/test.config.ts` - Centralized test configuration
- `playwright.config.ts` - Playwright-specific settings
- `.env.*` files - Environment-specific defaults

### Key Features
- **No Hardcoded Values**: All URLs and settings are configurable
- **Multiple Environments**: Support for dev, staging, production
- **Environment Variables**: Override any setting via env vars
- **Test Data Management**: Centralized JSON-based test data
- **Type Safety**: Full TypeScript configuration

### Default Settings
- **Base URL**: Configurable per environment (default: `https://www.tui.nl/h/nl`)
- **Timeouts**: Configurable via environment variables
- **Browser**: Chromium by default
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots/Videos**: Configurable via feature flags

See [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) for complete documentation.

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

1. **Proper POM Separation**: Page objects contain ONLY actions/locators, assertions in tests
2. **Flat Directory Structure**: Follows Node.js/Playwright conventions (pages/, utils/, fixtures/ at root)
3. **Fixtures Pattern**: Automatic dependency injection for page objects
4. **Environment Configuration**: No hardcoded URLs or values, all configurable
5. **Multi-Environment Support**: Easy switching between dev/staging/production
6. **Centralized Configuration**: All settings in one place with env var overrides
7. **Test Data Management**: JSON-based test data with type-safe loaders
8. **Centralized Locators**: Selectors separated from page logic
9. **Type Safety**: Full TypeScript with custom type definitions
10. **CI/CD Integration**: GitHub Actions workflow with environment support
11. **Explicit Waits**: Proper waiting strategies for elements
12. **Comprehensive Documentation**: Complete guides and README files

## Documentation

- [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) - Complete configuration guide
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Project structure documentation
- [config/README.md](config/README.md) - Configuration directory documentation
- [test-data/README.md](test-data/README.md) - Test data management guide
- [FIX_5_CONFIGURATION_COMPLETE.md](FIX_5_CONFIGURATION_COMPLETE.md) - Configuration system details

## Notes

- The test uses multiple selector strategies to handle different website implementations
- Random selection ensures different test runs cover various scenarios
- The test is designed to be resilient to minor UI changes
- All test data is logged for transparency and debugging

## License

ISC





# Fixtures

Playwright fixtures for automatic dependency injection and test setup.

## What Are Fixtures?

Fixtures are Playwright's way of providing reusable setup code to tests. Instead of manually instantiating objects in every test, fixtures automatically inject them as parameters.

## Page Fixtures

**File:** `pages.fixture.ts`

Automatically initializes all page objects for each test.

### Usage

**❌ Before (Manual Instantiation - BAD):**
```typescript
import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ResultsPage } from "../pages/SearchResultsPage";

test("booking flow", async ({ page }) => {
  // Manual instantiation - duplicated in every test
  const homePage = new HomePage(page);
  const resultsPage = new ResultsPage(page);
  
  await homePage.open();
  await resultsPage.openFirstAvailableHotel();
});
```

**✅ After (Fixtures - GOOD):**
```typescript
import { test, expect } from "../fixtures/pages.fixture";

test("booking flow", async ({ homePage, resultsPage }) => {
  // Page objects auto-injected - no manual instantiation needed
  await homePage.open();
  await resultsPage.openFirstAvailableHotel();
});
```

## Available Page Fixtures

All page objects are available as fixtures:

- `homePage` - HomePage instance
- `resultsPage` - ResultsPage instance
- `hotelDetailsPage` - HotelDetailsPage instance
- `flightsPage` - FlightsPage instance
- `passengerDetailsPage` - PassengerDetailsPage instance

## Benefits

### ✅ DRY Principle
- No repeated instantiation code
- Setup logic defined once, used everywhere
- Changes to setup affect all tests automatically

### ✅ Type Safety
- Full TypeScript autocomplete
- Compile-time type checking
- IDE suggestions for available fixtures

### ✅ Maintainability
- Add new fixtures in one place
- All tests automatically get new fixtures
- Easy to modify initialization logic

### ✅ Clean Tests
- Tests focus on behavior, not setup
- Less boilerplate code
- More readable test code

### ✅ Playwright Best Practice
- Official recommended pattern
- Aligns with Playwright documentation
- Industry standard approach

## How Fixtures Work

```typescript
// fixtures/pages.fixture.ts
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    // Setup: Create instance
    const homePage = new HomePage(page);
    
    // Use: Provide to test
    await use(homePage);
    
    // Teardown: Cleanup (if needed)
    // Automatic after test completes
  },
});
```

Each fixture:
1. **Setup**: Creates the object
2. **Use**: Provides it to the test
3. **Teardown**: Cleans up automatically after test

## Adding New Fixtures

To add a new page object fixture:

1. **Import the page object:**
```typescript
import { NewPage } from "../pages/NewPage";
```

2. **Add to type definition:**
```typescript
type PageFixtures = {
  // ... existing
  newPage: NewPage;
};
```

3. **Define the fixture:**
```typescript
export const test = base.extend<PageFixtures>({
  // ... existing
  newPage: async ({ page }, use) => {
    await use(new NewPage(page));
  },
});
```

4. **Use in tests:**
```typescript
test("test name", async ({ newPage }) => {
  await newPage.someAction();
});
```

## Custom Fixtures Examples

### API Client Fixture
```typescript
type APIFixtures = {
  apiClient: APIClient;
};

export const test = base.extend<APIFixtures>({
  apiClient: async ({}, use) => {
    const client = new APIClient(process.env.API_URL);
    await use(client);
    await client.cleanup();
  },
});
```

### Authenticated User Fixture
```typescript
type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("/login");
    await page.fill("#username", "testuser");
    await page.fill("#password", "password");
    await page.click("button[type='submit']");
    await use(page);
  },
});
```

### Test Data Fixture
```typescript
type DataFixtures = {
  testData: BookingData;
};

export const test = base.extend<DataFixtures>({
  testData: async ({}, use) => {
    const data = await loadTestData("booking-scenarios.json");
    await use(data);
  },
});
```

## Best Practices

### ✅ DO
- Import `test` and `expect` from fixture file, not `@playwright/test`
- Use descriptive fixture names (camelCase)
- Keep fixtures focused and single-purpose
- Document custom fixtures

### ❌ DON'T
- Mix fixture imports with `@playwright/test` imports
- Create fixtures with side effects
- Share mutable state between fixtures
- Manually instantiate objects that have fixtures

## Migration Guide

**Step 1: Update imports**
```typescript
// Before
import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

// After
import { test, expect } from "../fixtures/pages.fixture";
```

**Step 2: Remove manual instantiation**
```typescript
// Before
const homePage = new HomePage(page);

// After - use fixture parameter
test("name", async ({ homePage }) => {
  // homePage already available
});
```

**Step 3: Update all page object references**
```typescript
// Before
await homePage.open();

// After (same - just injected)
await homePage.open();
```

## References

- [Playwright Fixtures Documentation](https://playwright.dev/docs/test-fixtures)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- `tests/booking-flow.spec.ts` - Example usage

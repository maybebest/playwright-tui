# Getting Started Guide

Welcome to the TUI Playwright Test Automation Framework! This guide will help you understand the project structure and start contributing.

## Quick Start

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run tests
npm test

# Run with UI
npm run test:ui
```

## Project Philosophy

This project follows **industry-standard Playwright/Node.js conventions**:

### ✅ DO: Flat Structure
```
pages/          ← At root level
utils/          ← At root level
fixtures/       ← At root level
```

### ❌ DON'T: Nested in src/
```
src/
  pages/        ← WRONG (Java/Spring Boot pattern)
  utils/        ← WRONG (Not Node.js convention)
```

## Understanding the Structure

### 1. Page Objects (`pages/`)
**What they contain:**
- Locator getters (public for test access)
- Action methods (click, fill, navigate)
- Data retrieval methods

**What they DON'T contain:**
- ❌ NO `expect()` assertions
- ❌ NO test-specific logic
- ❌ NO hard-coded test data

**Example:**
```typescript
export class CheckoutPage {
  // ✅ Public getter for test assertions
  get totalPrice() {
    return this.page.locator("#total-price");
  }
  
  // ✅ Action method
  async completePayment() {
    await this.payButton.click();
  }
  
  // ✅ Data retrieval
  async getTotalAmount(): Promise<string> {
    return this.totalPrice.textContent();
  }
}
```

### 2. Tests (`tests/`)
**What they contain:**
- ALL `expect()` assertions
- Test-specific logic
- Test data
- Test flow orchestration

**Example:**
```typescript
test("checkout", async ({ page }) => {
  const checkout = new CheckoutPage(page);
  
  // ✅ Assertions in test
  await expect(checkout.totalPrice).toBeVisible();
  
  const amount = await checkout.getTotalAmount();
  expect(amount).toBe("€100.00");
  
  await checkout.completePayment();
});
```

### 3. Fixtures (`fixtures/`)
Automatically initialize page objects for cleaner tests:

```typescript
// Using fixture (recommended)
test("checkout", async ({ checkoutPage }) => {
  // checkoutPage is auto-initialized
  await checkoutPage.completePayment();
});

// Without fixture
test("checkout", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.completePayment();
});
```

### 4. Locators (`locators/`)
Centralized selector definitions:

```typescript
// locators/checkout.locators.ts
export const CheckoutLocators = {
  totalPrice: "#total-price",
  payButton: "[data-test-id='pay-button']",
  cardNumber: "input[name='cardNumber']",
};

// pages/CheckoutPage.ts
import { CheckoutLocators } from "../locators/checkout.locators";

get totalPrice() {
  return this.page.locator(CheckoutLocators.totalPrice);
}
```

**Benefits:**
- Update selectors in ONE place
- Share selectors across pages
- Self-documenting

### 5. Config (`config/`)
Centralized configuration:

```typescript
import { TEST_CONFIG } from "../config/test.config";

await page.goto(TEST_CONFIG.baseUrl);
await element.waitFor({ timeout: TEST_CONFIG.timeouts.navigation });
```

### 6. Types (`types/`)
TypeScript definitions for type safety:

```typescript
import { BookingData } from "../types/test-data.types";

function fillBooking(data: BookingData) {
  // TypeScript validates structure
}
```

### 7. Test Data (`test-data/`)
External data files:

```typescript
import scenarios from "../test-data/booking-scenarios.json";

test.each(scenarios.scenarios)("booking: $name", async ({ page }, scenario) => {
  // Use scenario data
});
```

### 8. Utils (`utils/`)
Shared helper functions:

```typescript
import { SeededRandom } from "../utils/random";
import { safeClick } from "../utils/ui";

const rng = new SeededRandom(12345);
const index = rng.pickIndex(items.length);
await safeClick(button);
```

## Adding New Features

### New Page Object

1. Create file: `pages/NewPage.ts`
2. Add locators: `locators/new-page.locators.ts`
3. Add fixture: Update `fixtures/pages.fixture.ts`
4. Create types: Add to `types/test-data.types.ts` if needed

```typescript
// pages/NewPage.ts
import { Page } from "@playwright/test";
import { NewPageLocators } from "../locators/new-page.locators";

export class NewPage {
  constructor(private page: Page) {}
  
  get mainElement() {
    return this.page.locator(NewPageLocators.main);
  }
  
  async performAction() {
    await this.mainElement.click();
  }
}
```

### New Test

1. Create file: `tests/new-feature.spec.ts`
2. Import page objects and fixtures
3. Write assertions in test

```typescript
import { test, expect } from "../fixtures/pages.fixture";

test("new feature", async ({ newPage }) => {
  // Assertions here
  await expect(newPage.mainElement).toBeVisible();
  await newPage.performAction();
});
```

### New Configuration

Add to `config/test.config.ts`:

```typescript
export const TEST_CONFIG = {
  // ... existing
  newFeature: {
    timeout: 5000,
    retries: 3,
  },
};
```

## Best Practices

### ✅ DO
- Keep page objects assertion-free
- Use fixtures for dependency injection
- Centralize selectors in `locators/`
- Use TypeScript types
- Add README to new directories
- Follow flat structure (root-level dirs)

### ❌ DON'T
- Put assertions in page objects
- Create `src/` directory
- Hard-code selectors in page objects
- Hard-code timeouts
- Skip type definitions
- Create nested directory structures

## CI/CD

Tests run automatically on:
- Push to main/master/develop
- Pull requests
- Daily at 2 AM UTC
- Manual trigger

See `.github/workflows/playwright-tests.yml` for configuration.

## Documentation

Every directory has a README.md:
- Purpose and responsibility
- Usage examples
- Best practices

**Main Guides:**
- `PROJECT_STRUCTURE.md` - Complete structure overview
- `REFACTORING_SUMMARY.md` - What changed and why
- This file - Getting started guide

## Common Patterns

### Waiting for Elements
```typescript
// In page object - expose getter
get loadingSpinner() {
  return this.page.locator(".spinner");
}

// In test - assert
await expect(page.loadingSpinner).toBeHidden();
```

### Random Data
```typescript
import { SeededRandom } from "../utils/random";

const rng = new SeededRandom(seed);
const index = rng.pickIndex(items.length);
```

### Retry Logic
```typescript
// Use config
import { TEST_CONFIG } from "../config/test.config";

for (let i = 0; i < TEST_CONFIG.retry.maxAttempts; i++) {
  try {
    await action();
    break;
  } catch {
    if (i === TEST_CONFIG.retry.maxAttempts - 1) throw;
  }
}
```

## Questions?

- Check directory READMEs
- Review `PROJECT_STRUCTURE.md`
- Look at existing tests for patterns
- Refer to [Playwright docs](https://playwright.dev)

Happy testing! 🎭

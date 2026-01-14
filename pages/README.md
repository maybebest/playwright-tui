# Page Objects

This directory contains Page Object Model (POM) classes for the TUI booking flow.

## Structure

All page objects extend `BasePage` which provides common functionality.

### BasePage
The base class provides shared methods:
- `getText(locator)` - Get text content (returns empty string instead of null)
- `getAttribute(locator, name)` - Get attribute value (returns empty string instead of null)
- `getCount(locator)` - Get count of matching elements
- `isVisible(locator)` - Check if element is visible
- `waitForVisible(locator, timeout?)` - Wait for element to be visible
- `waitForHidden(locator, timeout?)` - Wait for element to be hidden
- `goto(url)` - Navigate to a URL
- `getCurrentUrl()` - Get current page URL
- `getTitle()` - Get page title

**Benefits:**
- **DRY Principle**: No code duplication across pages
- **Consistency**: All pages use same methods for common operations
- **Error Handling**: Null safety built-in (no `.catch(() => null)` needed)
- **Maintainability**: Update behavior once, apply everywhere

### Page Objects

**HomePage** - TUI homepage with search functionality
- Airport selection
- Destination selection
- Date picker
- Room/guest configuration
- Returns booking data (no silent failures)

**SearchResultsPage** - Hotel search results
- List results
- Select hotel
- Returns hotel name

**HotelDetailsPage** - Hotel details view
- Overview container
- Continue to flights

**FlightsPage** - Flight selection
- Flight options
- Continue to passenger details

**PassengerDetailsPage** - Passenger information form
- Form validation
- Error message handling
- Returns validation errors (no retry loop masking issues)

## Best Practices

### ✅ DO
- Extend `BasePage` for all new page objects
- Use `BasePage` methods instead of direct Playwright calls
- Add return type annotations to all public methods
- Return meaningful data (no "Unknown" fallbacks)
- Let errors propagate (no silent `.catch()`)

### ❌ DON'T
- Add assertions (`expect()`) to page objects
- Catch and hide errors with default values
- Duplicate methods that exist in `BasePage`
- Use `private page: Page` (use `protected` in BasePage)

## Example

```typescript
import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get totalAmount() {
    return this.page.locator("#total");
  }

  async getTotalPrice(): Promise<string> {
    // Use BasePage method - no null handling needed
    return await this.getText(this.totalAmount);
  }

  async proceedToPayment(): Promise<void> {
    const button = this.page.locator("#pay-button");
    await button.click();
  }
}
```

## Migration from Independent Pages

**Before (Without BasePage):**
```typescript
// Code duplication, silent errors
const text = await locator.textContent().catch(() => "Unknown");
const count = await locator.count().catch(() => 0);
```

**After (With BasePage):**
```typescript
// Clean, reusable, fails fast
const text = await this.getText(locator);  // Empty string if not found
const count = await this.getCount(locator);  // Throws if error
```

## Type Safety

All page objects have:
- Return type annotations on public methods
- TypeScript types for data structures
- No `any` types

See `types/test-data.types.ts` for shared interfaces.

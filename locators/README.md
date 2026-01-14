# Locators

Centralized selector definitions for all page objects.

## Purpose
- **Single Source of Truth**: All selectors in one place
- **Easy Maintenance**: Update selectors without touching page objects
- **Reusability**: Share locators across multiple page objects
- **Documentation**: Self-documenting selector structure

## Structure

### home-page.locators.ts
Selectors for homepage interactions:
- Airport selection
- Destination selection
- Date picker
- Room/guest configuration
- Search functionality

### passenger-details.locators.ts
Selectors for passenger form:
- Input field patterns
- Validation error messages
- Form sections

## Usage

```typescript
import { HomePageLocators } from "../locators/home-page.locators";

class HomePage {
  get airportInput() {
    return this.page.locator(HomePageLocators.airportInput);
  }
}
```

## Best Practices
- Use data-test-id attributes when available
- Prefer stable selectors over CSS classes
- Document dynamic selectors
- Keep locators organized by page/component

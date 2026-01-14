# Types

TypeScript type definitions for the test framework.

## Files

### test-data.types.ts
Core type definitions:
- `BookingData`: Booking form data structure
- `PassengerData`: Passenger information structure
- `ValidationField`: Form validation field metadata
- `PassengerType`: Type unions for passenger categories
- `BookingSectionType`: Section identifiers for validation

## Purpose
- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Better IDE autocomplete
- **Documentation**: Self-documenting code
- **Refactoring**: Safe codebase changes

## Usage

```typescript
import { BookingData, PassengerData } from "../types/test-data.types";

async function fillBookingForm(data: BookingData) {
  // TypeScript ensures data has correct structure
}
```

## Best Practices
- Use interfaces for data structures
- Use type aliases for unions/primitives
- Export all public types
- Document complex types with JSDoc
- Keep types DRY (Don't Repeat Yourself)

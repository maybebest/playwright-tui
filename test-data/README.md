# Test Data

This directory contains all test data used by the test suites. Test data is separated from test logic to improve maintainability and reusability.

## Files

### `booking-scenarios.json`
Contains different booking scenarios that can be used in tests:
- Family with children
- Couples
- Large families
- Different age ranges

Each scenario includes:
- `name`: Unique identifier for the scenario
- `adults`: Number of adult passengers
- `children`: Number of child passengers
- `childAgeRange`: Min/max ages for children (optional)
- `description`: Human-readable description

### `test-data.loader.ts`
TypeScript loader for accessing test data in a type-safe manner.

Provides functions:
- `loadBookingScenarios()`: Load all booking scenarios
- `getScenarioByName(name)`: Get a specific scenario
- `getDefaultScenario()`: Get the default scenario
- `getAllScenarios()`: Get all scenarios as an array
- `validateScenario(scenario)`: Validate scenario structure

## Usage

### In Test Files

```typescript
import { getDefaultScenario, getScenarioByName } from "../test-data/test-data.loader";

test("booking flow with default scenario", async ({ homePage }) => {
  const scenario = getDefaultScenario();
  
  // Use scenario data
  console.log(`Testing with ${scenario.adults} adults and ${scenario.children} children`);
  // ... test implementation
});

test("booking flow with specific scenario", async ({ homePage }) => {
  const scenario = getScenarioByName("large_family");
  
  if (!scenario) {
    throw new Error("Scenario not found");
  }
  
  // Use scenario data
  // ... test implementation
});
```

### Data-Driven Tests

```typescript
import { getAllScenarios } from "../test-data/test-data.loader";

const scenarios = getAllScenarios();

for (const scenario of scenarios) {
  test(`booking flow - ${scenario.name}`, async ({ homePage }) => {
    // Run test with this scenario
  });
}
```

## Adding New Test Data

### Adding New Booking Scenarios

1. Edit `booking-scenarios.json`
2. Add new scenario following the structure:

```json
{
  "scenarios": [
    {
      "name": "solo_traveler",
      "adults": 1,
      "children": 0,
      "description": "Single adult traveler"
    }
  ]
}
```

### Adding New Test Data Files

1. Create new JSON file in this directory
2. Create corresponding loader in `test-data.loader.ts`
3. Export typed functions for accessing the data
4. Document in this README

Example structure:
```typescript
export interface MyDataType {
  field1: string;
  field2: number;
}

export function loadMyData(): MyDataType[] {
  const dataPath = join(__dirname, "my-data.json");
  const rawData = readFileSync(dataPath, "utf-8");
  return JSON.parse(rawData);
}
```

## Best Practices

1. **Keep data separate from logic** - Never hardcode test data in test files
2. **Use meaningful names** - Scenario names should be descriptive
3. **Validate data** - Use loader validation functions
4. **Document scenarios** - Add clear descriptions
5. **Version control** - All test data should be committed to git
6. **Type safety** - Always use the TypeScript loaders, not raw JSON imports

## Benefits

- **Maintainability**: Update test data without touching test code
- **Reusability**: Same data can be used across multiple tests
- **Scalability**: Easy to add new scenarios
- **Clarity**: Clear separation between test logic and test data
- **Type Safety**: TypeScript interfaces prevent data structure errors

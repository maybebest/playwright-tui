# Configuration

This directory contains all configuration files for the Playwright test framework.

## Files

### `environment.config.ts`
Manages environment-specific configurations including:
- Base URLs for different environments (dev, staging, production)
- API URLs
- Feature flags
- Environment variable support

### `test.config.ts`
Centralized test configuration with:
- Timeout settings (configurable via environment variables)
- Retry settings
- Selectors for common UI elements
- Test data defaults
- Feature flags for tracing, video, screenshots

## Environment Variables

The framework supports environment variables for flexible configuration:

### Required Variables
- `TEST_ENV`: Environment to run tests against (`dev`, `staging`, `production`)
  - Default: `dev`

### Optional Variables
- `BASE_URL`: Override the base URL for any environment
- `API_URL`: API endpoint URL (if testing APIs)
- `SEED`: Random seed for reproducible test runs
- `HEADLESS`: Run browser in headless mode (`true`/`false`)
- `SLOW_MO`: Slow down operations by specified milliseconds
- `CI`: Running in CI environment (`true`/`false`)
- `DEBUG`: Enable debug mode (`true`/`false`)
- `ENABLE_TRACE`: Enable Playwright tracing (`true`/`false`)
- `ENABLE_VIDEO`: Enable video recording (`true`/`false`)
- `ENABLE_SCREENSHOT`: Enable screenshots (`true`/`false`)
- `TEST_TIMEOUT`: Default test timeout in milliseconds
- `EXPECT_TIMEOUT`: Expect assertion timeout in milliseconds
- `RETRY_COUNT`: Number of retry attempts

## Usage Examples

### Using environment-specific configs

```bash
# Run tests in dev environment (default)
npx playwright test

# Run tests in staging environment
TEST_ENV=staging npx playwright test

# Run tests in production environment
TEST_ENV=production npx playwright test
```

### Custom URL override

```bash
# Override base URL for any environment
BASE_URL=https://custom.tui.nl/h/nl npx playwright test
```

### Using .env files

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your settings
# Then run tests (will automatically load .env.local)
npx playwright test
```

### Multiple environment variables

```bash
# Combine multiple settings
TEST_ENV=staging HEADLESS=false DEBUG=true npx playwright test
```

## Adding New Environments

To add a new environment:

1. Edit `environment.config.ts`
2. Add new environment to the `environments` object:

```typescript
const environments: Record<Environment, EnvironmentConfig> = {
  // ... existing environments
  qa: {
    name: "qa",
    baseUrl: "https://qa.tui.nl/h/nl",
    features: {
      enableLogging: true,
      enableTracing: true,
    },
  },
};
```

3. Update the `Environment` type:

```typescript
export type Environment = "dev" | "staging" | "production" | "qa";
```

4. Create corresponding .env file:

```bash
# .env.qa
TEST_ENV=qa
BASE_URL=https://qa.tui.nl/h/nl
HEADLESS=true
```

## Best Practices

1. **Never commit `.env` or `.env.local`** - these may contain sensitive data
2. **Always keep `.env.example` updated** - document all available variables
3. **Use environment-specific files** - `.env.dev`, `.env.staging`, etc. for team defaults
4. **Prefer environment variables** for CI/CD pipelines over hardcoded values
5. **Document any new configuration** in this README

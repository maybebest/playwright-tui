import { ENV_CONFIG } from "./environment.config";

/**
 * Centralized Test Configuration
 * 
 * This configuration uses environment variables and the environment.config.ts
 * for URL management, ensuring tests are configurable across different environments.
 */

// Helper to get environment variable with type safety
function getEnvVar(key: string, defaultValue: string | number | boolean): string | number | boolean {
  const value = (globalThis as any).process?.env?.[key];
  
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  if (typeof defaultValue === "number") {
    return Number(value);
  }
  
  if (typeof defaultValue === "boolean") {
    return value === "true" || value === "1";
  }
  
  return value;
}

export const TEST_CONFIG = {
  // URLs from environment configuration
  baseUrl: ENV_CONFIG.baseUrl,
  apiUrl: ENV_CONFIG.apiUrl,
  
  // Timeouts - optimized for fail-fast to catch performance issues early
  // Previously: 5min test timeout, 40s navigation, 15s expect - too slow to fail
  // Now: Aggressive timeouts that expose real performance problems quickly
  timeouts: {
    default: getEnvVar("TEST_TIMEOUT", 30_000), // 30s max per test (reduced from 60s)
    action: 5_000, // 5s for clicks, fills, and standard actions
    expect: getEnvVar("EXPECT_TIMEOUT", 5_000), // 5s for assertions (reduced from 10s)
    navigation: 10_000, // 10s for page navigation (reduced from 15s)
  },

  retry: {
    maxAttempts: getEnvVar("RETRY_COUNT", 2), // 2 retries max - fail fast rather than mask issues
    delayMs: 250, // 250ms delay - faster feedback on failures
  },

  selectors: {
    cookieBanner: ".CookieBanner",
    cookieAcceptButton: ".CookieBanner__accept",
  },

  testData: {
    defaultAdults: 2,
    defaultChildren: 1,
    childAgeRange: { min: 0, max: 17 },
  },

  // Feature flags from environment
  features: {
    enableLogging: ENV_CONFIG.features?.enableLogging ?? false,
    enableTracing: getEnvVar("ENABLE_TRACE", true),
    enableVideo: getEnvVar("ENABLE_VIDEO", true),
    enableScreenshot: getEnvVar("ENABLE_SCREENSHOT", true),
  },
} as const;

export const ENV = {
  seed: getEnvVar("SEED", Date.now()),
  headless: getEnvVar("HEADLESS", true),
  slowMo: getEnvVar("SLOW_MO", 0),
  ci: getEnvVar("CI", false),
  debug: getEnvVar("DEBUG", false),
} as const;

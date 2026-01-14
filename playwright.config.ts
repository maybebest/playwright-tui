import { defineConfig, devices } from "@playwright/test";
import { TEST_CONFIG, ENV } from "./config/test.config";

/**
 * Playwright Configuration
 * 
 * This configuration uses centralized test configuration with environment variable support.
 * 
 * Usage:
 * - Default (dev): npx playwright test
 * - Staging: TEST_ENV=staging npx playwright test
 * - Production: TEST_ENV=production npx playwright test
 * - Custom URL: BASE_URL=https://custom.url.com npx playwright test
 */

export default defineConfig({
  testDir: "./tests",
  timeout: TEST_CONFIG.timeouts.default,
  expect: { timeout: TEST_CONFIG.timeouts.expect },
  retries: ENV.ci ? 2 : 0,
  
  use: {
    baseURL: TEST_CONFIG.baseUrl,
    trace: TEST_CONFIG.features.enableTracing ? "on-first-retry" : "off",
    screenshot: TEST_CONFIG.features.enableScreenshot ? "only-on-failure" : "off",
    video: TEST_CONFIG.features.enableVideo ? "retain-on-failure" : "off",
    headless: ENV.headless,
    launchOptions: {
      slowMo: ENV.slowMo,
    },
  },
  
  projects: [
    { 
      name: "chromium", 
      use: { 
        ...devices["Desktop Chrome"],
      } 
    },
  ],
  
  // Reporter configuration
  reporter: [
    ["html"],
    ["list"],
  ],
});
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 240_000,
  expect: { timeout: 15_000 },
  retries: (globalThis as any).process?.env?.CI ? 2 : 0,
  use: {
    baseURL: "https://www.tui.nl/h/nl",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
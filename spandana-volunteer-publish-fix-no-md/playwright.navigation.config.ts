import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Keep discovery scoped to the navigation suite. Relative paths are resolved from this config file.
  testDir: "./tests/navigation",
  testMatch: "**/*.spec.ts",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "qa/navigation-report", open: "never" }]],
  use: {
    baseURL: process.env.SPANDANA_BASE_URL || "http://127.0.0.1:5173",
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true } },
  ],
});

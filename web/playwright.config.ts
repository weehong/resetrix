import { defineConfig, devices } from "@playwright/test";

const isProductionTest = process.env["E2E_PRODUCTION"] === "true";

/**
 * See https://playwright.dev/docs/test-configuration
 * and https://nextjs.org/docs/app/guides/testing/playwright
 */
export default defineConfig({
	testDir: "./e2e",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env["CI"],
	/* Retry on CI only */
	retries: process.env["CI"] ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env["CI"] ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	/* Shared settings for all the projects below. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: "http://localhost:3001",
		/* Collect trace when retrying the failed test. */
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],

	/* Run either the dev server or a freshly verified production build. */
	webServer: {
		command: isProductionTest
			? "npm run build:seo && npm run start:standalone:test"
			: "npm run dev",
		url: "http://localhost:3001",
		reuseExistingServer: !process.env["CI"] && !isProductionTest,
		timeout: 120 * 1000,
	},
});

import { test, expect } from "@playwright/test";

test("home page renders the site name as its h1", async ({ page }) => {
	// baseURL is set via `use.baseURL` in playwright.config.ts
	await page.goto("/");
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the page paints the light token surface, not a default white", async ({
	page,
}) => {
	await page.goto("/");
	// --bg resolves to neutral-50 (#f8f7f7). A regression in the token bridge
	// shows up here as rgb(255, 255, 255) or a transparent body.
	await expect(page.locator("body")).toHaveCSS(
		"background-color",
		"rgb(248, 247, 247)"
	);
});

test("body copy is set in Inter, not a system fallback", async ({ page }) => {
	await page.goto("/");
	const family = await page
		.locator("body")
		.evaluate((el) => getComputedStyle(el).fontFamily);
	expect(family).toMatch(/Inter/i);
});

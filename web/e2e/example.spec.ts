import { test, expect } from "@playwright/test";

test("home page renders the Resetrix value proposition", async ({ page }) => {
	// baseURL is set via `use.baseURL` in playwright.config.ts
	await page.goto("/");
	await expect(page.getByRole("heading", { level: 1 })).toContainText(
		"Software that fits"
	);
});

test("the page paints the Botanical light surface", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("body")).toHaveCSS(
		"background-color",
		"rgb(246, 248, 238)"
	);
});

test("body copy is set in Inter, not a system fallback", async ({ page }) => {
	await page.goto("/");
	const family = await page
		.locator("body")
		.evaluate((el) => getComputedStyle(el).fontFamily);
	expect(family).toMatch(/Inter/i);
});

test("appearance choice persists across a reload", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("radio", { name: "Dark" }).click();
	await expect(page.locator("html")).toHaveClass(/dark/);
	await page.reload();
	await expect(page.locator("html")).toHaveClass(/dark/);
	await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
});

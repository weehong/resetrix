import { test, expect } from "@playwright/test";

test("home page renders the greeting", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle("Resetrix");
	await expect(page.getByText("Hello, world!")).toBeVisible();
});

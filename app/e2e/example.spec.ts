import { test, expect } from "@playwright/test";

test("landing page renders the public entry", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle("Resetrix");
	await expect(page.getByRole("heading", { name: "Resetrix" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});

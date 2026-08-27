import { test, expect } from "@playwright/test";

test("home page renders the Resetrix value proposition", async ({ page }) => {
	// baseURL is set via `use.baseURL` in playwright.config.ts
	await page.goto("/");
	await expect(page.getByRole("heading", { level: 1 })).toContainText(
		"Does your software fit"
	);
});

test("page indexing follows the deployment environment", async ({ page }) => {
	await page.goto("/");
	const expected =
		process.env["APP_ENVIRONMENT"] === "production"
			? "index, follow"
			: "noindex, nofollow";
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		expected
	);
});

test("the page uses the Botanical surface", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("body")).toHaveClass(/bg-surface/);
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
	const darkAppearance = page.getByRole("button", {
		name: "Use dark appearance",
	});
	await darkAppearance.click();
	await expect(page.locator("html")).toHaveClass(/dark/);
	await page.reload();
	await expect(page.locator("html")).toHaveClass(/dark/);
	await expect(
		page.getByRole("button", { name: "Use dark appearance" })
	).toHaveAttribute("aria-pressed", "true");
});

const serviceRoutes = [
	["/operational-transformation", /fix the operational bottleneck/i],
	["/software-customisation", /keep the tools that work/i],
] as const;

for (const [path, heading] of serviceRoutes) {
	test(`${path} renders a meaningful heading`, async ({ page }) => {
		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page.getByRole("heading", { level: 1 })).toContainText(
			heading
		);
	});
}

test("unknown routes return a genuine accessible 404", async ({ page }) => {
	const response = await page.goto("/this-url-should-not-exist");
	expect(response?.status()).toBe(404);
	await expect(page.getByRole("main")).toBeVisible();
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("404");
	await expect(page.getByRole("link", { name: "Go back home" })).toBeVisible();
});

test("crawl files have direct responses and correct content types", async ({
	request,
}) => {
	const robots = await request.get("/robots.txt");
	const sitemap = await request.get("/sitemap.xml");

	expect(robots.status()).toBe(200);
	expect(robots.headers()["content-type"]).toContain("text/plain");
	expect(sitemap.status()).toBe(200);
	expect(sitemap.headers()["content-type"]).toContain("application/xml");
	const robotsBody = await robots.text();
	expect(robotsBody).not.toContain("<!DOCTYPE html>");
	if (process.env["APP_ENVIRONMENT"] === "production") {
		expect(robotsBody).toBe(
			"User-Agent: *\nAllow: /\n\nSitemap: https://resetrix.com/sitemap.xml\n"
		);
	} else {
		expect(robotsBody).toBe("User-Agent: *\nDisallow: /\n\n");
	}
	expect(await sitemap.text()).toContain(
		"https://resetrix.com/software-customisation"
	);
});

const socialImagePaths = [
	"/opengraph-image",
	"/operational-transformation/opengraph-image",
	"/software-customisation/opengraph-image",
] as const;

for (const path of socialImagePaths) {
	test(`${path} serves a crawlable social image`, async ({ request }) => {
		const response = await request.get(path);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain("image/png");
		expect((await response.body()).byteLength).toBeGreaterThan(1_000);
	});
}

const brandAssetPaths = [
	["/icon.svg", "image/svg+xml"],
	["/apple-icon", "image/png"],
	["/brand/resetrix-wordmark.svg", "image/svg+xml"],
	["/manifest.webmanifest", "application/manifest+json"],
] as const;

for (const [path, contentType] of brandAssetPaths) {
	test(`${path} resolves for metadata consumers`, async ({ request }) => {
		const response = await request.get(path);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain(contentType);
		expect((await response.body()).byteLength).toBeGreaterThan(100);
	});
}

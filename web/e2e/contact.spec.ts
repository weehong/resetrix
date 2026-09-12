import { expect, test } from "@playwright/test";

// Playwright supplies a dummy site key to its dev/build server.
// The script and contact endpoint are intercepted; no provider is contacted.
test("inquiry verification survives a rejected submission and retries with a fresh token", async ({
	page,
}) => {
	await page.route(
		"https://challenges.cloudflare.com/turnstile/v0/api.js*",
		(route) =>
			route.fulfill({
				contentType: "application/javascript",
				body: `
			let count = 0;
			const widgets = new Map();
			window.turnstile = {
				render(container, options) {
					const id = 'widget-' + (++count);
					const button = document.createElement('button');
					button.type = 'button';
					button.textContent = 'Complete test verification';
					button.onclick = () => options.callback(id);
					container.appendChild(button);
					widgets.set(id, button);
					return id;
				},
				remove(id) { widgets.get(id)?.remove(); widgets.delete(id); }
			};`,
			})
	);
	const tokens: Array<string> = [];
	await page.route("**/api/contact", async (route) => {
		tokens.push(route.request().postDataJSON()["cf-turnstile-response"]);
		await route.fulfill(
			tokens.length === 1
				? { status: 429, contentType: "text/plain", body: "Rate limited" }
				: { status: 200, json: { success: true } }
		);
	});
	await page.goto("/");
	await page.getByLabel("Name", { exact: true }).fill("Alex");
	await page.getByLabel("Work email").fill("alex@example.com");
	await page.getByLabel("Company", { exact: true }).fill("Example");
	await page.getByLabel("Your role").selectOption("Operations");
	await page.getByLabel("Team size").selectOption("11-50");
	await page.getByLabel("Target timeframe").selectOption("Within 3 months");
	for (const field of ["workflow", "impact", "systems", "outcome"]) {
		// Browser interactions are intentionally sequential.
		// eslint-disable-next-line no-await-in-loop
		await page
			.locator(`textarea[name="${field}"]`)
			.fill("Example inquiry details");
	}
	await page.getByRole("button", { name: "Request a fit call" }).click();
	await expect(
		page.getByText(
			"Please complete the verification before sending your enquiry."
		)
	).toBeVisible();
	expect(tokens).toHaveLength(0);
	await page
		.getByRole("button", { name: "Complete test verification" })
		.click();
	await page.getByRole("button", { name: "Request a fit call" }).click();
	await expect(page.getByText(/too many attempts/i)).toBeVisible();
	await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Alex");
	await page
		.getByRole("button", { name: "Complete test verification" })
		.click();
	await page.getByRole("button", { name: "Request a fit call" }).click();
	await expect(
		page.getByText(/thanks. your enquiry has been sent/i)
	).toBeVisible();
	await expect(page.getByLabel("Name", { exact: true })).toHaveValue("");
	expect(tokens).toHaveLength(2);
	expect(tokens[0]).not.toBe(tokens[1]);
});

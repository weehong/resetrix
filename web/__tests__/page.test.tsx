import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { siteConfig } from "../lib/site-config";

// Note: Vitest can unit-test synchronous Server/Client Components. For `async`
// Server Components, prefer E2E tests (see ./e2e). Reference:
// https://nextjs.org/docs/app/guides/testing/vitest

// Asserting against siteConfig rather than a copy literal: the heading is the
// site name by definition, so rebranding should not break the test.
test("Home page renders the site name as its h1", () => {
	render(<Home />);
	expect(
		screen.getByRole("heading", { level: 1, name: siteConfig.name })
	).toBeDefined();
});

test("Home page links out with the external-link safety attributes", () => {
	render(<Home />);
	const external = screen.getByRole("link", {
		name: /next\.js documentation/i,
	});
	expect(external.getAttribute("target")).toBe("_blank");
	expect(external.getAttribute("rel")).toContain("noopener");
});

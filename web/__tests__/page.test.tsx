import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { siteConfig } from "../lib/site-config";

// Note: Vitest can unit-test synchronous Server/Client Components. For `async`
// Server Components, prefer E2E tests (see ./e2e). Reference:
// https://nextjs.org/docs/app/guides/testing/vitest

test("Home page presents the Resetrix value proposition as its h1", () => {
	render(<Home />);
	expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
		/software that fits the way your business works/i
	);
});

test("Home page exposes the documented Resetrix services", () => {
	render(<Home />);
	expect(
		screen.getByRole("heading", { name: /digital transformation/i })
	).toBeDefined();
	expect(
		screen.getByRole("heading", { name: /software customization/i })
	).toBeDefined();
	expect(siteConfig.name).toBe("Resetrix");
});

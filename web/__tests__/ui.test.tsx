import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui/button";
import { Heading } from "../components/ui/heading";
import { Link } from "../components/ui/link";

// These cover the two things the primitives encode that are easy to regress by
// hand-editing a class string: the accessible-contrast pairings baked into the
// variants, and the level/size split in Heading.

test("Button defaults to type=button so it cannot submit a form by accident", () => {
	render(<Button>Save</Button>);
	expect(screen.getByRole("button").getAttribute("type")).toBe("button");
});

test("accent Button pairs the cyan fill with dark ink, never white", () => {
	render(<Button variant="accent">Go</Button>);
	const className = screen.getByRole("button").className;
	expect(className).toContain("bg-accent");
	expect(className).toContain("text-accent-ink");
	expect(className).not.toContain("text-white");
});

test("Heading renders the requested level independently of the visual size", () => {
	render(
		<Heading level={2} size="display">
			Heading
		</Heading>
	);
	expect(screen.getByRole("heading", { level: 2 })).toBeDefined();
});

test("internal links use accent-text rather than the raw brand accent", () => {
	render(<Link href="/about">About</Link>);
	const className = screen.getByRole("link").className;
	expect(className).toContain("text-accent-text");
});

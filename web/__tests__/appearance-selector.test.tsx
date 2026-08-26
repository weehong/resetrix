import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppearanceSelector } from "../components/appearance-selector";

test("persists an explicit appearance and applies it to the document", async () => {
	const user = userEvent.setup();
	render(<AppearanceSelector />);

	await user.click(screen.getByRole("radio", { name: "Dark" }));

	expect(localStorage.getItem("appearance")).toBe("dark");
	expect(document.documentElement).toHaveClass("dark");
	expect(screen.getByRole("radio", { name: "Dark" })).toHaveAttribute(
		"aria-checked",
		"true"
	);
});

test("system appearance follows the operating-system preference", async () => {
	const user = userEvent.setup();
	vi.mocked(window.matchMedia).mockReturnValue({
		...window.matchMedia(""),
		matches: true,
	});
	render(<AppearanceSelector />);

	await user.click(screen.getByRole("radio", { name: "System" }));

	expect(localStorage.getItem("appearance")).toBe("system");
	expect(document.documentElement).toHaveClass("dark");
});

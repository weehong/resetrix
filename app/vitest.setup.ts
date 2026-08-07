import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
// jest-dom v6: registers the matchers on Vitest's expect as a side effect.
import "@testing-library/jest-dom/vitest";

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
});

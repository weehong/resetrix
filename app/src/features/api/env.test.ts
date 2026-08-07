import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("apiEnv", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("throws at module load when VITE_API_URL is missing or empty", async () => {
		vi.stubEnv("VITE_API_URL", "");

		await expect(import("@/features/api/env")).rejects.toThrow(
			"Invalid API environment variables:"
		);
	});

	it("rejects a value that is not a URL", async () => {
		vi.stubEnv("VITE_API_URL", "localhost:3000");

		await expect(import("@/features/api/env")).rejects.toThrow(
			"Invalid API environment variables:"
		);
	});

	it("exposes the base URL without a trailing slash, frozen", async () => {
		vi.stubEnv("VITE_API_URL", "http://localhost:3000/");

		const { apiEnv } = await import("@/features/api/env");

		expect(apiEnv).toStrictEqual({ baseUrl: "http://localhost:3000" });
		expect(Object.isFrozen(apiEnv)).toBe(true);
	});
});

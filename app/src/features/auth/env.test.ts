import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const VALID_ENV = {
	VITE_AUTH0_DOMAIN: "your-tenant.us.auth0.com",
	VITE_AUTH0_CLIENT_ID: "spa-client-id",
	VITE_AUTH0_AUDIENCE: "https://api.resetrix.dev",
} as const;

const stubValidEnv = (): void => {
	vi.stubEnv("VITE_AUTH0_DOMAIN", VALID_ENV.VITE_AUTH0_DOMAIN);
	vi.stubEnv("VITE_AUTH0_CLIENT_ID", VALID_ENV.VITE_AUTH0_CLIENT_ID);
	vi.stubEnv("VITE_AUTH0_AUDIENCE", VALID_ENV.VITE_AUTH0_AUDIENCE);
};

describe("auth0Env", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("throws at module load when required Auth0 variables are missing", async () => {
		vi.stubEnv("VITE_AUTH0_DOMAIN", "");
		vi.stubEnv("VITE_AUTH0_CLIENT_ID", "");
		vi.stubEnv("VITE_AUTH0_AUDIENCE", "");

		await expect(import("@/features/auth/env")).rejects.toThrow(
			"Invalid Auth0 environment variables:"
		);
	});

	it("rejects a domain that includes a protocol or path", async () => {
		vi.stubEnv("VITE_AUTH0_DOMAIN", "https://your-tenant.us.auth0.com/");
		vi.stubEnv("VITE_AUTH0_CLIENT_ID", VALID_ENV.VITE_AUTH0_CLIENT_ID);
		vi.stubEnv("VITE_AUTH0_AUDIENCE", VALID_ENV.VITE_AUTH0_AUDIENCE);

		await expect(import("@/features/auth/env")).rejects.toThrow(
			"bare Auth0 domain"
		);
	});

	it("derives the callback URL from the origin when unset", async () => {
		stubValidEnv();

		const { auth0Env } = await import("@/features/auth/env");

		expect(auth0Env).toStrictEqual({
			domain: VALID_ENV.VITE_AUTH0_DOMAIN,
			clientId: VALID_ENV.VITE_AUTH0_CLIENT_ID,
			audience: VALID_ENV.VITE_AUTH0_AUDIENCE,
			callbackUrl: `${window.location.origin}/callback`,
			logoutReturnUrl: window.location.origin,
		});
		expect(Object.isFrozen(auth0Env)).toBe(true);
	});

	it("honours an explicit callback URL override", async () => {
		stubValidEnv();
		vi.stubEnv("VITE_AUTH0_CALLBACK_URL", "https://app.example.com/callback");

		const { auth0Env } = await import("@/features/auth/env");

		expect(auth0Env.callbackUrl).toBe("https://app.example.com/callback");
	});
});

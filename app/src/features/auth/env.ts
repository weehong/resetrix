import { z } from "zod";

/**
 * Schema for the Auth0 environment the SPA consumes. Every value the gate
 * needs is validated here so a misconfigured deploy fails at boot instead of
 * redirecting Users to a broken tenant. See docs/auth0-operator-setup.md.
 */
const Auth0EnvSchema = z.object({
	VITE_AUTH0_DOMAIN: z
		.string()
		.min(1)
		.refine((value) => !value.includes("://") && !value.includes("/"), {
			message:
				"must be a bare Auth0 domain (e.g. your-tenant.us.auth0.com), without protocol or path",
		}),
	VITE_AUTH0_CLIENT_ID: z.string().min(1),
	VITE_AUTH0_AUDIENCE: z.string().min(1),
	// Optional override for the redirect URI; defaults to "<origin>/callback"
	// below. Empty strings count as "unset".
	VITE_AUTH0_CALLBACK_URL: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z.string().url().optional()
	),
});

const parsed = Auth0EnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
	// Fail fast: never boot a gate pointing at a half-configured tenant. This
	// runs at module evaluation, before React renders.
	const issues = parsed.error.issues
		.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
		.join("\n");
	throw new Error(`Invalid Auth0 environment variables:\n${issues}`);
}

export type Auth0Env = {
	domain: string;
	clientId: string;
	audience: string;
	callbackUrl: string;
	logoutReturnUrl: string;
};

/** Validated, immutable Auth0 configuration. */
export const auth0Env: Readonly<Auth0Env> = Object.freeze({
	domain: parsed.data.VITE_AUTH0_DOMAIN,
	clientId: parsed.data.VITE_AUTH0_CLIENT_ID,
	audience: parsed.data.VITE_AUTH0_AUDIENCE,
	callbackUrl:
		parsed.data.VITE_AUTH0_CALLBACK_URL ??
		`${window.location.origin}/callback`,
	logoutReturnUrl: window.location.origin,
});

import { z } from "zod";

/**
 * Fallback connection string for local development/test only. Production must
 * supply its own `DATABASE_URL` (enforced below) so the app never silently
 * connects to a throwaway local database.
 */
const LOCAL_DATABASE_URL =
	"postgresql://postgres:postgres@localhost:5432/resetrix?schema=public";

/**
 * Schema for every environment variable the app consumes. Coercions live here so
 * the rest of the codebase works with typed, validated values instead of raw
 * strings.
 */
const EnvSchema = z.object({
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	PORT: z.coerce.number().int().positive().default(3000),
	LOG_LEVEL: z
		.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
		.default("info"),
	CORS_ORIGIN: z.string().default("http://localhost:5173"),
	RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
	RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
	// Whether to trust `x-forwarded-*` headers (client IP + protocol). Enable
	// only when running behind a known reverse proxy / load balancer; trusting
	// these headers when directly exposed lets clients spoof their IP.
	TRUST_PROXY: z
		.enum(["true", "false"])
		.default("false")
		.transform((value) => value === "true"),
	DATABASE_URL: z.string().url().optional(),
	// Auth0 (API audience). Optional in development/test so unauthenticated
	// probes and docs still boot; production must supply all three.
	// Empty strings count as "unset" for Auth0 config.
	AUTH0_JWKS_URI: z.string().url().optional().or(z.literal("")),
	AUTH0_ISSUER: z.string().url().optional().or(z.literal("")),
	AUTH0_AUDIENCE: z.string().optional(),
	// Test-only HS256 secret used when AUTH0_JWKS_URI is unset (so signed test
	// JWTs need no remote JWKS). Never used in production.
	AUTH0_TEST_JWT_SECRET: z.string().optional(),
	// Namespace prefix for the roles custom claim in Auth0 access tokens.
	AUTH0_ROLES_NAMESPACE: z.string().default("https://resetrix.dev"),
});

/**
 * Require `DATABASE_URL` in production but fall back to a local instance in
 * development/test. Done as a transform (rather than a field `.default`) so we
 * can tell whether the value was actually supplied before defaulting it.
 */
const ConfiguredEnvSchema = EnvSchema.transform((config, context) => {
	if (config.NODE_ENV === "production") {
		let hasIssue = false;
		for (const key of [
			"DATABASE_URL",
			"AUTH0_JWKS_URI",
			"AUTH0_ISSUER",
			"AUTH0_AUDIENCE",
		] as const) {
			if (!config[key]) {
				hasIssue = true;
				context.addIssue({
					code: z.ZodIssueCode.custom,
					path: [key],
					message: `${key} is required in production`,
				});
			}
		}
		if (hasIssue) {
			return z.NEVER;
		}
	}

	return {
		...config,
		DATABASE_URL: config.DATABASE_URL ?? LOCAL_DATABASE_URL,
	};
});

export type Env = z.infer<typeof ConfiguredEnvSchema>;

const parsed = ConfiguredEnvSchema.safeParse(process.env);

if (!parsed.success) {
	// Fail fast: a misconfigured environment should never boot a half-working
	// server. Use the bare console here because the logger itself depends on a
	// valid `LOG_LEVEL`.
	const issues = parsed.error.issues
		.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
		.join("\n");
	process.stderr.write(`Invalid environment variables:\n${issues}\n`);
	process.exit(1);
}

/** Validated, immutable application configuration. */
export const env: Readonly<Env> = Object.freeze(parsed.data);

export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
export const isDevelopment = env.NODE_ENV === "development";

import { z } from "zod";

/**
 * Schema for the HTTP API endpoint the SPA calls. Validated at boot so a
 * misconfigured deploy fails fast instead of sending Bearer tokens to the
 * wrong origin.
 */
const ApiEnvSchema = z.object({
	// z.string().url() alone accepts any scheme ("localhost:3000" parses as
	// scheme "localhost:"); the SPA needs a real http(s) origin.
	VITE_API_URL: z
		.string()
		.url()
		.refine((value) => /^https?:\/\//.test(value), {
			message: "must be an http(s) URL (e.g. http://localhost:3000)",
		}),
});

const parsed = ApiEnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
	// Fail fast: never boot an API client pointing at a half-configured
	// endpoint. This runs at module evaluation, before React renders.
	const issues = parsed.error.issues
		.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
		.join("\n");
	throw new Error(`Invalid API environment variables:\n${issues}`);
}

export type ApiEnv = {
	baseUrl: string;
};

/** Validated, immutable API configuration. */
export const apiEnv: Readonly<ApiEnv> = Object.freeze({
	// Callers append paths ("/api/v1/me"), so a trailing slash here would
	// double up separators.
	baseUrl: parsed.data.VITE_API_URL.replace(/\/+$/, ""),
});

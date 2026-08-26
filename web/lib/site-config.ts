/**
 * Central SEO / site configuration. Single source of truth imported by the
 * metadata, robots, sitemap, manifest, OG-image and structured-data modules.
 *
 * Shared by metadata, manifests, structured data and generated images.
 */

const DEFAULT_URL = "http://localhost:3001";

const appEnvironment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT ?? "development";

/**
 * Search-engine indexing is enabled **only in production**. In every other
 * environment (development, preview, staging) crawlers are blocked via
 * `robots.txt` and pages emit `noindex, nofollow`, so non-production
 * deployments are never indexed.
 */
export const isProductionEnv: boolean = appEnvironment === "production";

export const siteConfig = {
	/** Full brand / site name — used as the default <title> and OG site name. */
	name: "Resetrix",
	/** Short name for the web app manifest (home-screen label). */
	shortName: "Resetrix",
	/** Default meta description. */
	description:
		"Resetrix helps SMEs rethink operations, build software around their business, and move forward with practical digital guidance.",
	/** Absolute canonical origin (no trailing slash). */
	url: process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_URL,
	/** Open Graph locale. */
	locale: "en_US",
	/** Default keywords. */
	keywords: [
		"digital transformation",
		"custom software",
		"digital consultancy",
		"SME software",
		"Resetrix",
	],
	/** Author / creator attribution. */
	author: "Resetrix",
	creator: "Resetrix",
	/** Alt text for the default OG/Twitter image. */
	ogImageAlt: "Resetrix: Re-think. Re-work. Re-focus.",
	/** Browser chrome colors matching the Botanical page grounds. */
	themeColor: {
		light: "#f6f8ee",
		dark: "#172a1f",
	},
	/** Botanical signal accent. */
	accentColor: "#dfcc28",
} as const;

export type SiteConfig = typeof siteConfig;

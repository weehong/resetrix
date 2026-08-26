/**
 * Central SEO / site configuration. Single source of truth imported by the
 * metadata, robots, sitemap, manifest, OG-image and structured-data modules.
 *
 * Shared by metadata, manifests, structured data and generated images.
 */

const DEFAULT_SITE_ORIGIN = "https://resetrix.com";

function parseSiteOrigin(value: string): string {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new Error("SITE_ORIGIN must be a valid absolute URL");
	}

	if (
		url.protocol !== "https:" ||
		url.origin !== value ||
		url.pathname !== "/" ||
		url.search ||
		url.hash
	) {
		throw new Error(
			"SITE_ORIGIN must be an HTTPS origin with no trailing slash, path, query, or fragment"
		);
	}

	return value;
}

/** Canonical production origin shared by every absolute SEO URL. */
export const SITE_ORIGIN = parseSiteOrigin(
	process.env.SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN
);

const appEnvironment =
	process.env.APP_ENVIRONMENT ?? process.env.NODE_ENV ?? "development";

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
		"Resetrix helps Singapore SMEs remove operational bottlenecks, connect existing systems and build focused software around the way their business works.",
	/** Absolute canonical origin (no trailing slash). */
	url: SITE_ORIGIN,
	/** Open Graph locale. */
	locale: "en_US",
	/** Default keywords. */
	keywords: [
		"digital transformation Singapore",
		"custom software Singapore",
		"workflow automation",
		"SME systems integration",
		"operational transformation",
		"Resetrix",
	],
	/** Author / creator attribution. */
	author: "Resetrix",
	creator: "Resetrix",
	/** Alt text for the default OG/Twitter image. */
	ogImageAlt: "Resetrix: Connected operations for Singapore SMEs",
	/** Browser chrome colors matching the Botanical page grounds. */
	themeColor: {
		light: "#f6f8ee",
		dark: "#172a1f",
	},
	/** Botanical signal accent. */
	accentColor: "#dfcc28",
} as const;

export type SiteConfig = typeof siteConfig;

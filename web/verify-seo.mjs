import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const origin = process.env.SITE_ORIGIN ?? "https://resetrix.com";
const outputRoot = resolve(".next/server/app");
const parsedOrigin = new URL(origin);

assert.equal(parsedOrigin.protocol, "https:", "SITE_ORIGIN must use HTTPS");
assert.equal(
	parsedOrigin.origin,
	origin,
	"SITE_ORIGIN must not include a path or trailing slash"
);

const routes = JSON.parse(readFileSync(resolve("lib/seo-routes.json"), "utf8"));

function decodeHtml(value) {
	return value
		.replaceAll("&amp;", "&")
		.replaceAll("&quot;", '"')
		.replaceAll("&#x27;", "'")
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">");
}

function values(html, pattern) {
	return [...html.matchAll(pattern)].map((match) => decodeHtml(match[1] ?? ""));
}

function assertOne(html, pattern, expected, label) {
	const found = values(html, pattern);
	assert.deepEqual(
		found,
		[expected],
		`${label}: expected exactly one matching tag`
	);
}

function textContent(value) {
	return decodeHtml(value.replaceAll(/<[^>]+>/g, " "))
		.replaceAll(/\s+/g, " ")
		.trim();
}

for (const field of ["path", "title", "description", "imagePath"]) {
	assert.equal(
		new Set(routes.map((route) => route[field])).size,
		routes.length,
		`${field} values must be unique`
	);
}

for (const route of routes) {
	const html = readFileSync(resolve(outputRoot, route.file), "utf8");
	const canonical = `${origin}${route.path === "/" ? "" : route.path}`;
	const image = `${origin}${route.imagePath}`;

	const headings = values(html, /<h1[^>]*>(.*?)<\/h1>/gs).map(textContent);
	assert.equal(headings.length, 1, `${route.path}: exactly one H1`);
	assert.ok(headings[0].includes(route.h1), `${route.path}: expected H1 copy`);
	assert.equal(
		values(html, /(<main(?:\s[^>]*)?>)/g).length,
		1,
		`${route.path}: exactly one main landmark`
	);
	assertOne(
		html,
		/<title>(.*?)<\/title>/g,
		route.title,
		`${route.path}: title`
	);
	assertOne(
		html,
		/<meta name="description" content="(.*?)"\/>/g,
		route.description,
		`${route.path}: description`
	);
	assertOne(
		html,
		/<link rel="canonical" href="(.*?)"\/>/g,
		canonical,
		`${route.path}: canonical`
	);
	assertOne(
		html,
		/<meta name="robots" content="(.*?)"\/>/g,
		"index, follow",
		`${route.path}: robots`
	);
	assertOne(
		html,
		/<meta property="og:title" content="(.*?)"\/>/g,
		route.title,
		`${route.path}: og:title`
	);
	assertOne(
		html,
		/<meta property="og:description" content="(.*?)"\/>/g,
		route.description,
		`${route.path}: og:description`
	);
	assertOne(
		html,
		/<meta property="og:url" content="(.*?)"\/>/g,
		canonical,
		`${route.path}: og:url`
	);
	assertOne(
		html,
		/<meta property="og:image" content="(.*?)"\/>/g,
		image,
		`${route.path}: og:image`
	);
	assertOne(
		html,
		/<meta property="og:type" content="(.*?)"\/>/g,
		"website",
		`${route.path}: og:type`
	);
	assertOne(
		html,
		/<meta property="og:image:alt" content="(.*?)"\/>/g,
		route.imageAlt,
		`${route.path}: og:image:alt`
	);
	assertOne(
		html,
		/<meta name="twitter:card" content="(.*?)"\/>/g,
		"summary_large_image",
		`${route.path}: twitter:card`
	);
	assertOne(
		html,
		/<meta name="twitter:title" content="(.*?)"\/>/g,
		route.title,
		`${route.path}: twitter:title`
	);
	assertOne(
		html,
		/<meta name="twitter:description" content="(.*?)"\/>/g,
		route.description,
		`${route.path}: twitter:description`
	);
	assertOne(
		html,
		/<meta name="twitter:image" content="(.*?)"\/>/g,
		image,
		`${route.path}: twitter:image`
	);
	assertOne(
		html,
		/<meta name="twitter:image:alt" content="(.*?)"\/>/g,
		route.imageAlt,
		`${route.path}: twitter:image:alt`
	);

	const socialImage = readFileSync(
		resolve(outputRoot, `${route.imagePath.slice(1)}.body`)
	);
	assert.equal(
		socialImage.subarray(0, 8).toString("hex"),
		"89504e470d0a1a0a",
		`${route.path}: social image must be PNG`
	);
	assert.equal(
		socialImage.readUInt32BE(16),
		1200,
		`${route.path}: image width`
	);
	assert.equal(
		socialImage.readUInt32BE(20),
		630,
		`${route.path}: image height`
	);

	const jsonLd = values(
		html,
		/<script type="application\/ld\+json">(.*?)<\/script>/g
	);
	if (route.path === "/") {
		assert.equal(jsonLd.length, 1, "homepage: one JSON-LD object");
		const organization = JSON.parse(jsonLd[0]);
		assert.equal(organization["@context"], "https://schema.org");
		assert.equal(organization["@type"], "Organization");
		assert.equal(organization.name, "Resetrix");
		assert.equal(organization.url, `${origin}/`);
		assert.equal(organization.logo, `${origin}/brand/resetrix-wordmark.svg`);
		assert.ok(
			existsSync(resolve("public/brand/resetrix-wordmark.svg")),
			"Organization logo must exist as a public asset"
		);
		assert.equal(organization.email, "hello@resetrix.com");
		assert.equal(
			organization.description,
			"Resetrix helps Singapore SMEs improve connected operations by addressing workflow and software-fit bottlenecks."
		);
		for (const unsupported of [
			"address",
			"telephone",
			"sameAs",
			"foundingDate",
			"aggregateRating",
			"review",
		]) {
			assert.equal(
				organization[unsupported],
				undefined,
				`Organization must omit ${unsupported}`
			);
		}
	} else {
		assert.equal(
			jsonLd.length,
			0,
			`${route.path}: no duplicate Organization JSON-LD`
		);
	}
}

const sitemap = readFileSync(resolve(outputRoot, "sitemap.xml.body"), "utf8");
assert.deepEqual(
	values(sitemap, /<loc>(.*?)<\/loc>/g),
	routes.map(({ path }) => `${origin}${path === "/" ? "" : path}`),
	"sitemap URLs"
);
assert.doesNotMatch(sitemap, /<(lastmod|changefreq|priority)>/);

const robots = readFileSync(resolve(outputRoot, "robots.txt.body"), "utf8");
assert.equal(
	robots,
	`User-Agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
);

const manifest = JSON.parse(
	readFileSync(resolve(outputRoot, "manifest.webmanifest.body"), "utf8")
);
assert.deepEqual(manifest.icons, [
	{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
	{ src: "/apple-icon", sizes: "180x180", type: "image/png" },
]);
assert.ok(existsSync(resolve("app/icon.svg")), "SVG favicon must exist");

const favicon = readFileSync(resolve(outputRoot, "icon.svg.body"), "utf8");
assert.match(favicon, /^<svg\b/);
assert.doesNotMatch(
	favicon,
	/<(?:rect|image)\b/,
	"favicon must be transparent"
);

const appleIcon = readFileSync(resolve(outputRoot, "apple-icon.body"));
assert.equal(appleIcon.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
assert.equal(appleIcon.readUInt32BE(16), 180, "Apple icon width");
assert.equal(appleIcon.readUInt32BE(20), 180, "Apple icon height");

const vercelConfig = JSON.parse(readFileSync(resolve("vercel.json"), "utf8"));
assert.equal(vercelConfig.buildCommand, "npm run build:vercel");
assert.deepEqual(vercelConfig.redirects, [
	{
		source: "/:path*",
		has: [{ type: "host", value: "www.resetrix.com" }],
		destination: "https://resetrix.com/:path*",
		permanent: true,
	},
]);

const notFound = readFileSync(resolve(outputRoot, "_not-found.html"), "utf8");
assert.match(notFound, /<title>Page Not Found \| Resetrix<\/title>/);
assertOne(
	notFound,
	/<meta name="robots" content="(.*?)"\/>/g,
	"noindex",
	"not found: robots"
);
assert.deepEqual(
	values(notFound, /<h1[^>]*>(.*?)<\/h1>/gs).map(textContent),
	["404"],
	"not found: exactly one H1"
);
assert.equal(
	values(notFound, /(<main(?:\s[^>]*)?>)/g).length,
	1,
	"not found: exactly one main landmark"
);

console.log("SEO build artifacts verified");

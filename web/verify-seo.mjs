import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const origin = process.env.SITE_ORIGIN ?? "https://resetrix.com";
const outputRoot = resolve(".next/server/app");

const routes = [
	{
		file: "index.html",
		path: "/",
		title: "Connected Operations for Singapore SMEs | Resetrix",
		description:
			"Fix manual hand-offs, disconnected data and workflow bottlenecks. Resetrix helps Singapore SMEs improve operations without replacing everything.",
		image: "/opengraph-image",
		h1: "Does your software fit",
	},
	{
		file: "operational-transformation.html",
		path: "/operational-transformation",
		title: "Operational Transformation for SMEs in Singapore | Resetrix",
		description:
			"Map the workflow holding growth back and choose the least-complex change to improve capacity, visibility and reliability.",
		image: "/operational-transformation/opengraph-image",
		h1: "Fix the operational bottleneck",
	},
	{
		file: "software-customisation.html",
		path: "/software-customisation",
		title: "Software Customisation & Integration for SMEs | Resetrix",
		description:
			"Keep the tools that work and close the gaps that do not. Resetrix customises and connects business software for Singapore SMEs.",
		image: "/software-customisation/opengraph-image",
		h1: "Keep the tools that work",
	},
];

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
	assert.deepEqual(found, [expected], `${label}: expected exactly one matching tag`);
}

for (const route of routes) {
	const html = readFileSync(resolve(outputRoot, route.file), "utf8");
	const canonical = `${origin}${route.path === "/" ? "" : route.path}`;
	const image = `${origin}${route.image}`;

	assert.match(html, new RegExp(`<h1[^>]*>[^]*${route.h1}`), `${route.path}: H1`);
	assertOne(html, /<title>(.*?)<\/title>/g, route.title, `${route.path}: title`);
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
	assertOne(html, /<meta property="og:title" content="(.*?)"\/>/g, route.title, `${route.path}: og:title`);
	assertOne(html, /<meta property="og:description" content="(.*?)"\/>/g, route.description, `${route.path}: og:description`);
	assertOne(html, /<meta property="og:url" content="(.*?)"\/>/g, canonical, `${route.path}: og:url`);
	assertOne(html, /<meta property="og:image" content="(.*?)"\/>/g, image, `${route.path}: og:image`);
	assertOne(html, /<meta property="og:type" content="(.*?)"\/>/g, "website", `${route.path}: og:type`);
	assert.equal(values(html, /<meta property="og:image:alt" content="(.*?)"\/>/g).length, 1, `${route.path}: og:image:alt`);
	assertOne(html, /<meta name="twitter:card" content="(.*?)"\/>/g, "summary_large_image", `${route.path}: twitter:card`);
	assertOne(html, /<meta name="twitter:title" content="(.*?)"\/>/g, route.title, `${route.path}: twitter:title`);
	assertOne(html, /<meta name="twitter:description" content="(.*?)"\/>/g, route.description, `${route.path}: twitter:description`);
	assertOne(html, /<meta name="twitter:image" content="(.*?)"\/>/g, image, `${route.path}: twitter:image`);

	const jsonLd = values(
		html,
		/<script type="application\/ld\+json">(.*?)<\/script>/g
	);
	if (route.path === "/") {
		assert.equal(jsonLd.length, 1, "homepage: one JSON-LD object");
		const organization = JSON.parse(jsonLd[0]);
		assert.equal(organization["@type"], "Organization");
		assert.equal(organization.url, `${origin}/`);
		assert.equal(organization.email, "hello@resetrix.com");
		for (const unsupported of ["address", "telephone", "sameAs", "foundingDate", "aggregateRating", "review"]) {
			assert.equal(organization[unsupported], undefined, `Organization must omit ${unsupported}`);
		}
	} else {
		assert.equal(jsonLd.length, 0, `${route.path}: no duplicate Organization JSON-LD`);
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

const notFound = readFileSync(resolve(outputRoot, "_not-found.html"), "utf8");
assert.match(notFound, /<title>Page Not Found \| Resetrix<\/title>/);
assert.match(notFound, /<meta name="robots" content="noindex"\/>/);
assert.match(notFound, /<h1[^>]*>404<\/h1>/);

console.log("SEO build artifacts verified");

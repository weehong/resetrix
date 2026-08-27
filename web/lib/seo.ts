import type { Metadata } from "next";
import { isProductionEnv, siteConfig, SITE_ORIGIN } from "@/lib/site-config";
import routeSeoEntries from "@/lib/seo-routes.json";

export type PublicRoutePath =
	"/" | "/operational-transformation" | "/software-customisation";

export const PUBLIC_ROUTE_PATHS: ReadonlyArray<PublicRoutePath> =
	routeSeoEntries.map((route) => route.path as PublicRoutePath);

type RouteSeo = {
	readonly title: string;
	readonly description: string;
	readonly canonicalPath: PublicRoutePath;
	readonly openGraph: {
		readonly title: string;
		readonly description: string;
		readonly imagePath: string;
		readonly imageAlt: string;
	};
	readonly indexable: true;
};

export const ROUTE_SEO: Readonly<Record<PublicRoutePath, RouteSeo>> =
	Object.fromEntries(
		routeSeoEntries.map((route) => [
			route.path,
			{
				title: route.title,
				description: route.description,
				canonicalPath: route.path,
				openGraph: {
					title: route.title,
					description: route.description,
					imagePath: route.imagePath,
					imageAlt: route.imageAlt,
				},
				indexable: true,
			},
		])
	) as Record<PublicRoutePath, RouteSeo>;

export function absoluteUrl(path: string): string {
	return `${SITE_ORIGIN}${path === "/" ? "" : path}`;
}

export function getRouteMetadata(path: PublicRoutePath): Metadata {
	const route = ROUTE_SEO[path];
	const canonical = absoluteUrl(route.canonicalPath);
	const image = absoluteUrl(route.openGraph.imagePath);
	const robots = route.indexable && isProductionEnv;

	return {
		title: { absolute: route.title },
		description: route.description,
		alternates: { canonical },
		robots: robots
			? {
					index: true,
					follow: true,
					googleBot: {
						index: true,
						follow: true,
						"max-image-preview": "large",
						"max-snippet": -1,
						"max-video-preview": -1,
					},
				}
			: { index: false, follow: false },
		openGraph: {
			type: "website",
			siteName: siteConfig.name,
			locale: siteConfig.locale,
			title: route.openGraph.title,
			description: route.openGraph.description,
			url: canonical,
			images: [{ url: image, alt: route.openGraph.imageAlt }],
		},
		twitter: {
			card: "summary_large_image",
			title: route.openGraph.title,
			description: route.openGraph.description,
			images: [{ url: image, alt: route.openGraph.imageAlt }],
		},
	};
}

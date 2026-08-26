import type { Metadata } from "next";
import { isProductionEnv, siteConfig, SITE_ORIGIN } from "@/lib/site-config";

export const PUBLIC_ROUTE_PATHS = [
	"/",
	"/operational-transformation",
	"/software-customisation",
] as const;

export type PublicRoutePath = (typeof PUBLIC_ROUTE_PATHS)[number];

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

export const ROUTE_SEO: Readonly<Record<PublicRoutePath, RouteSeo>> = {
	"/": {
		title: "Connected Operations for Singapore SMEs | Resetrix",
		description:
			"Fix manual hand-offs, disconnected data and workflow bottlenecks. Resetrix helps Singapore SMEs improve operations without replacing everything.",
		canonicalPath: "/",
		openGraph: {
			title: "Connected Operations for Singapore SMEs | Resetrix",
			description:
				"Fix manual hand-offs, disconnected data and workflow bottlenecks. Resetrix helps Singapore SMEs improve operations without replacing everything.",
			imagePath: "/opengraph-image",
			imageAlt: "Resetrix connected operations for Singapore SMEs",
		},
		indexable: true,
	},
	"/operational-transformation": {
		title: "Operational Transformation for SMEs in Singapore | Resetrix",
		description:
			"Map the workflow holding growth back and choose the least-complex change to improve capacity, visibility and reliability.",
		canonicalPath: "/operational-transformation",
		openGraph: {
			title: "Operational Transformation for SMEs in Singapore | Resetrix",
			description:
				"Map the workflow holding growth back and choose the least-complex change to improve capacity, visibility and reliability.",
			imagePath: "/operational-transformation/opengraph-image",
			imageAlt: "Resetrix operational transformation for Singapore SMEs",
		},
		indexable: true,
	},
	"/software-customisation": {
		title: "Software Customisation & Integration for SMEs | Resetrix",
		description:
			"Keep the tools that work and close the gaps that do not. Resetrix customises and connects business software for Singapore SMEs.",
		canonicalPath: "/software-customisation",
		openGraph: {
			title: "Software Customisation & Integration for SMEs | Resetrix",
			description:
				"Keep the tools that work and close the gaps that do not. Resetrix customises and connects business software for Singapore SMEs.",
			imagePath: "/software-customisation/opengraph-image",
			imageAlt: "Resetrix software customisation and integration for SMEs",
		},
		indexable: true,
	},
};

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
		robots: { index: robots, follow: robots },
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
			images: [image],
		},
	};
}

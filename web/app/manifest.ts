import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Generates /manifest.webmanifest. Icons point at the static /icon.svg and
// generated /apple-icon routes. For full PWA installability add 192x192 and
// 512x512 (maskable) PNGs and reference them here too.
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteConfig.name,
		short_name: siteConfig.shortName,
		description: siteConfig.description,
		start_url: "/",
		display: "standalone",
		background_color: siteConfig.themeColor.light,
		theme_color: siteConfig.themeColor.light,
		icons: [
			{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
			{ src: "/apple-icon", sizes: "180x180", type: "image/png" },
		],
	};
}

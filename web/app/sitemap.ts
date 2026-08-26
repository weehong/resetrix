import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Generates /sitemap.xml. Add an entry per indexable route. For large or
// dynamic route sets, map over your data source here (or split with
// `generateSitemaps`).
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		["", 1],
		["/operational-transformation", 0.8],
		["/software-customisation", 0.8],
	].map(([path, priority]) => ({
		url: `${siteConfig.url}${path}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: Number(priority),
	}));
}

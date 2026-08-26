import type { MetadataRoute } from "next";
import { absoluteUrl, PUBLIC_ROUTE_PATHS } from "@/lib/seo";

// Generates /sitemap.xml. Add an entry per indexable route. For large or
// dynamic route sets, map over your data source here (or split with
// `generateSitemaps`).
export default function sitemap(): MetadataRoute.Sitemap {
	return PUBLIC_ROUTE_PATHS.map((path) => ({ url: absoluteUrl(path) }));
}

import type { Organization, WithContext } from "schema-dts";
import { siteConfig } from "@/lib/site-config";

/** Site-wide Organization schema (publisher identity). */
export function getOrganizationSchema(): WithContext<Organization> {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.name,
		url: `${siteConfig.url}/`,
		logo: `${siteConfig.url}/icon`,
		email: "hello@resetrix.com",
		description:
			"Resetrix helps Singapore SMEs improve connected operations by addressing workflow and software-fit bottlenecks.",
	};
}

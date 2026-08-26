import { MarketingHome } from "@/components/marketing-home";
import { JsonLd } from "@/components/json-ld";
import { getRouteMetadata } from "@/lib/seo";
import { getOrganizationSchema } from "@/lib/structured-data";

export const metadata = getRouteMetadata("/");

export default function Home(): React.ReactElement {
	return (
		<>
			<JsonLd data={getOrganizationSchema()} />
			<MarketingHome />
		</>
	);
}

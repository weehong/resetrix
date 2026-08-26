import { ServicePathPage } from "@/components/service-path-page";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/software-customisation");

export default function SoftwareCustomisation(): React.ReactElement {
	return <ServicePathPage type="customisation" />;
}

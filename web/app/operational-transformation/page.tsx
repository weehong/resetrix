import { ServicePathPage } from "@/components/service-path-page";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/operational-transformation");

export default function OperationalTransformation(): React.ReactElement {
	return <ServicePathPage type="transformation" />;
}

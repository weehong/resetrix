import { ServicePathPage } from "@/components/service-path-page";
import { getRouteMetadata } from "@/lib/seo";

export const metadata = getRouteMetadata("/workflow-digitalisation");

export default function WorkflowDigitalisation(): React.ReactElement {
	return <ServicePathPage type="digitalisation" />;
}

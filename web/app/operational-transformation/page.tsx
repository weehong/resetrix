import type { Metadata } from "next";
import { ServicePathPage } from "@/components/service-path-page";

const description =
	"Map operational bottlenecks, manual hand-offs and fragmented data before choosing the least-complex change for your Singapore SME.";

export const metadata: Metadata = {
	title: "Operational transformation for Singapore SMEs",
	description,
	alternates: { canonical: "/operational-transformation" },
	openGraph: {
		title: "Operational transformation for Singapore SMEs",
		description,
		url: "/operational-transformation",
	},
};

export default function OperationalTransformation(): React.ReactElement {
	return <ServicePathPage type="transformation" />;
}

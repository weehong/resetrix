import type { Metadata } from "next";
import { ServicePathPage } from "@/components/service-path-page";

const description =
	"Configure, connect and extend the software your SME already uses, closing workflow and data gaps without replacing everything at once.";

export const metadata: Metadata = {
	title: "Software customisation and integration for SMEs",
	description,
	alternates: { canonical: "/software-customisation" },
	openGraph: {
		title: "Software customisation and integration for SMEs",
		description,
		url: "/software-customisation",
	},
};

export default function SoftwareCustomisation(): React.ReactElement {
	return <ServicePathPage type="customisation" />;
}

import type { Metadata } from "next";
import { MarketingHome } from "@/components/marketing-home";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
	title: { absolute: "Resetrix | Connected operations for Singapore SMEs" },
	description: siteConfig.description,
	alternates: { canonical: "/" },
	openGraph: {
		title: "Resetrix | Connected operations for Singapore SMEs",
		description: siteConfig.description,
		url: "/",
	},
};

export default function Home(): React.ReactElement {
	return <MarketingHome />;
}

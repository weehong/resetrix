import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";

// Next.js automatically injects <meta name="robots" content="noindex"> for
// pages that return a 404 status.
export const metadata: Metadata = {
	title: "404 – Page not found",
	description: "The page you are looking for does not exist.",
};

export default function NotFound(): React.ReactElement {
	return (
		<Container
			width="narrow"
			className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center"
		>
			<Heading level={1} size="xl">
				404
			</Heading>
			<p className="text-ink-soft">
				The page you are looking for does not exist.
			</p>
			<Link href="/">Go back home</Link>
		</Container>
	);
}

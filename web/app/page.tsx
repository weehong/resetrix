import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { siteConfig } from "@/lib/site-config";

// Per-route metadata example. The home page lives in the *root* segment, so the
// root layout's title template ("%s | Site") does not wrap it — use `absolute`
// to control the full <title>. Child routes inherit the template automatically
// (e.g. app/not-found.tsx renders "404 – Page not found | Next.js Boilerplate").
export const metadata: Metadata = {
	title: { absolute: siteConfig.name },
	description: siteConfig.description,
	alternates: { canonical: "/" },
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.description,
		url: "/",
	},
};

const STARTING_POINTS = [
	{
		title: "app/page.tsx",
		body: "This page. Replace it with real content — the primitives it uses are the ones the rest of the site should use.",
	},
	{
		title: "app/tokens.css",
		body: "The palette and the semantic layer. Change a value here and every component follows; nothing hard-codes a colour.",
	},
	{
		title: "components/ui",
		body: "Button, Card, Container, Heading and Link. Each has a story — run `npm run storybook` to see the full set against the tokens.",
	},
] as const;

export default function Home(): React.ReactElement {
	return (
		<Container as="main" className="flex flex-1 flex-col justify-center py-24">
			<div className="max-w-2xl">
				<Eyebrow>Getting started</Eyebrow>
				<Heading level={1} size="display" className="mt-4">
					{siteConfig.name}
				</Heading>
				<p className="mt-6 text-lg leading-relaxed text-ink-dim">
					{siteConfig.description}
				</p>
				<div className="mt-10 flex flex-col gap-3 sm:flex-row">
					<Button size="lg">Primary action</Button>
					<Button size="lg" variant="outline">
						Secondary action
					</Button>
				</div>
			</div>

			<ul className="mt-20 grid gap-4 sm:grid-cols-3">
				{STARTING_POINTS.map((point, index) => (
					<Card as="li" key={point.title} accent={index === 0}>
						<CardTitle>{point.title}</CardTitle>
						<CardBody>{point.body}</CardBody>
					</Card>
				))}
			</ul>

			<p className="mt-12 text-sm text-ink-dim">
				Appearance decisions are recorded in <code>docs/adr/0011</code>.
				Framework reference lives in the{" "}
				<Link href="https://nextjs.org/docs">Next.js documentation</Link>.
			</p>
		</Container>
	);
}

import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import Providers from "./providers";
import { JsonLd } from "@/components/json-ld";
import { isProductionEnv, siteConfig } from "@/lib/site-config";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/structured-data";
import "./globals.css";

// Both are variable fonts, so omitting `weight` ships one file per family
// covering the whole axis — cheaper than pinning the 600/700/800 and 400/500/600
// sets the previous site loaded from the Google CDN, and with no third-party
// request at all. app/tokens.css composes these into --typeface-display and
// --typeface-body; nothing outside that file should reference them directly.
const sora = Sora({
	variable: "--font-sora",
	subsets: ["latin"],
	display: "swap",
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	keywords: [...siteConfig.keywords],
	authors: [{ name: siteConfig.author }],
	creator: siteConfig.creator,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		url: "/",
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
		locale: siteConfig.locale,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		creator: siteConfig.twitterHandle,
	},
	// Indexing is allowed in production only; non-production emits noindex,nofollow.
	robots: isProductionEnv
		? {
				index: true,
				follow: true,
				googleBot: {
					index: true,
					follow: true,
					"max-image-preview": "large",
					"max-snippet": -1,
					"max-video-preview": -1,
				},
			}
		: { index: false, follow: false },
	manifest: "/manifest.webmanifest",
	appleWebApp: {
		capable: true,
		title: siteConfig.shortName,
		statusBarStyle: "default",
	},
	formatDetection: { telephone: false },
	// verification: { google: "your-google-site-verification-token" },
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	// Light-only for now (ADR 0011). When a dark scheme lands, restore the
	// prefers-color-scheme pair here and add the matching `html.dark` block to
	// app/tokens.css — siteConfig.themeColor.dark already holds the value.
	colorScheme: "light",
	themeColor: siteConfig.themeColor.light,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): React.ReactElement {
	return (
		<html
			lang="en"
			className={`${sora.variable} ${inter.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-bg text-ink">
				<JsonLd data={getWebSiteSchema()} />
				<JsonLd data={getOrganizationSchema()} />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import Providers from "./providers";
import { JsonLd } from "@/components/json-ld";
import { isProductionEnv, siteConfig } from "@/lib/site-config";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/structured-data";
import "./globals.css";

const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	display: "swap",
	axes: ["opsz", "SOFT"],
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
	colorScheme: "light dark",
	themeColor: [
		{
			media: "(prefers-color-scheme: light)",
			color: siteConfig.themeColor.light,
		},
		{
			media: "(prefers-color-scheme: dark)",
			color: siteConfig.themeColor.dark,
		},
	],
};

const appearanceScript = `(function(){try{var p=localStorage.getItem("appearance");var a=p==="light"||p==="dark"||p==="system"?p:"system";var d=a==="dark"||(a==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.dataset.appearance=a}catch(e){var d=matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);document.documentElement.dataset.appearance="system"}})();`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): React.ReactElement {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col bg-surface text-ink">
				<JsonLd data={getWebSiteSchema()} />
				<JsonLd data={getOrganizationSchema()} />
				<Providers>{children}</Providers>
				<Script
					id="resolve-appearance"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{ __html: appearanceScript }}
				/>
			</body>
		</html>
	);
}

import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/lib/site-config";
import "./tokens.css";
import "./globals.css";

const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	display: "swap",
	weight: ["600", "700"],
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
				{children}
				<Script
					id="resolve-appearance"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{ __html: appearanceScript }}
				/>
			</body>
		</html>
	);
}

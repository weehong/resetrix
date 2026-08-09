import NextLink from "next/link";
import { cn } from "@/lib/cn";

export type LinkProps = {
	href: string;
	/**
	 * `quiet` drops the underline and inherits colour — for links inside a
	 * nav or a card title, where the surrounding context already signals that
	 * the thing is clickable.
	 */
	tone?: "accent" | "quiet";
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const TONES = {
	// --accent-text, not --accent. The brand cyan is 1.69:1 on the page
	// background and is unreadable as text; this is its AA-safe counterpart at
	// 5.01:1. Getting this wrong is the single easiest way to break the theme.
	accent:
		"text-accent-text underline underline-offset-[0.2em] hover:decoration-2",
	quiet: "text-inherit no-underline hover:text-accent-text",
} as const;

function isExternal(href: string): boolean {
	return (
		/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href) || href.startsWith("mailto:")
	);
}

/**
 * Routes through `next/link` for in-app hrefs so client navigation and
 * prefetching work, and falls back to a plain anchor for anything that leaves
 * the site — passing an absolute URL to `next/link` gets you a full page load
 * with none of the safety attributes.
 */
export function Link({
	href,
	tone = "accent",
	className,
	...props
}: LinkProps): React.ReactElement {
	const classes = cn("rounded-xs transition-colors", TONES[tone], className);

	if (isExternal(href)) {
		return (
			<a
				href={href}
				className={classes}
				rel="noopener noreferrer"
				target="_blank"
				{...props}
			/>
		);
	}

	return <NextLink href={href} className={classes} {...props} />;
}

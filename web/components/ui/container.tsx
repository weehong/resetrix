import { cn } from "@/lib/cn";

type ContainerWidth = "narrow" | "default" | "wide" | "full";

const WIDTHS: Record<ContainerWidth, string> = {
	narrow: "max-w-2xl", // long-form reading measure
	default: "max-w-5xl",
	wide: "max-w-7xl",
	full: "max-w-none",
};

export type ContainerProps = {
	width?: ContainerWidth;
	as?: "div" | "section" | "main" | "header" | "footer" | "article";
	className?: string;
	children?: React.ReactNode;
};

/**
 * Horizontal rhythm for the page. The gutter comes from `--pad-x`
 * (`clamp(1.25rem, 6vw, 7rem)`), carried over from the previous marketing site
 * so section edges line up the way they used to, rather than from a fixed
 * Tailwind padding step that would not scale with the viewport.
 */
export function Container({
	width = "default",
	as: Tag = "div",
	className,
	children,
}: ContainerProps): React.ReactElement {
	return (
		<Tag
			className={cn("mx-auto w-full px-(--pad-x)", WIDTHS[width], className)}
		>
			{children}
		</Tag>
	);
}

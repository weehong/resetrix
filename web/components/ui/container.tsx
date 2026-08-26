import { cn } from "@/lib/cn";

type ContainerWidth = "narrow" | "default" | "wide" | "full";

const WIDTHS: Record<ContainerWidth, string> = {
	narrow: "max-w-[680px]",
	default: "max-w-[1200px]",
	wide: "max-w-[1400px]",
	full: "max-w-none",
};

export type ContainerProps = {
	width?: ContainerWidth;
	as?: "div" | "section" | "main" | "header" | "footer" | "article";
	className?: string;
	children?: React.ReactNode;
};

/** Botanical page widths with 24, 40 and 64px responsive gutters. */
export function Container({
	width = "default",
	as: Tag = "div",
	className,
	children,
}: ContainerProps): React.ReactElement {
	return (
		<Tag
			className={cn(
				"mx-auto w-full px-6 md:px-10 lg:px-16",
				WIDTHS[width],
				className
			)}
		>
			{children}
		</Tag>
	);
}

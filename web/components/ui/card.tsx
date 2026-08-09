import { cn } from "@/lib/cn";

export type CardProps = {
	/**
	 * `raised` lifts off the page on `--bg-soft`; `inset` recedes into it on
	 * `--bg-inset`. Both read as "not the page", in opposite directions.
	 */
	tone?: "raised" | "inset";
	/** Draws a cyan rule along the top edge. For the one card that matters. */
	accent?: boolean;
	as?: "div" | "article" | "li" | "section";
	className?: string;
	children?: React.ReactNode;
};

const TONES = {
	raised: "bg-bg-soft border-line",
	inset: "bg-bg-inset border-transparent",
} as const;

/**
 * A surface. The border is `--line` at 1.30:1 — deliberately faint, and
 * decorative rather than informative, so the tone change carries the
 * separation and the border only sharpens the edge.
 */
export function Card({
	tone = "raised",
	accent = false,
	as: Tag = "div",
	className,
	children,
}: CardProps): React.ReactElement {
	return (
		<Tag
			className={cn(
				"relative overflow-hidden rounded-(--radius-lg) border p-6",
				TONES[tone],
				accent &&
					"before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-accent",
				className
			)}
		>
			{children}
		</Tag>
	);
}

export type CardTitleProps = {
	className?: string;
	children?: React.ReactNode;
};

export function CardTitle({
	className,
	children,
}: CardTitleProps): React.ReactElement {
	return (
		<h3
			className={cn(
				"font-display text-lg font-semibold tracking-[-0.01em] text-ink",
				className
			)}
		>
			{children}
		</h3>
	);
}

export type CardBodyProps = {
	className?: string;
	children?: React.ReactNode;
};

export function CardBody({
	className,
	children,
}: CardBodyProps): React.ReactElement {
	return (
		<p className={cn("mt-2 leading-relaxed text-ink-dim", className)}>
			{children}
		</p>
	);
}

import { cn } from "@/lib/cn";

export type CardProps = {
	/**
	 * `raised` lifts from the page; `inset` uses the alternating Botanical band.
	 */
	tone?: "raised" | "inset";
	/** Draws the Botanical gold signal rule for one emphasized card. */
	accent?: boolean;
	as?: "div" | "article" | "li" | "section";
	className?: string;
	children?: React.ReactNode;
};

const TONES = {
	raised:
		"bg-surface-raised border-transparent shadow-(--shadow-sm) dark:border-hairline dark:shadow-none",
	inset: "bg-surface-band border-transparent",
} as const;

/** A Botanical surface separated primarily by its ground step. */
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
				"relative overflow-hidden rounded-[20px] border p-8",
				TONES[tone],
				accent &&
					"before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-accent",
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
				"font-display text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-[1.3] tracking-[-0.008em] text-ink",
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
		<p
			className={cn(
				"mt-3 text-[0.9375rem] leading-[1.6] text-ink-soft",
				className
			)}
		>
			{children}
		</p>
	);
}

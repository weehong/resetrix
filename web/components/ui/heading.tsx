import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingSize = "display" | "xl" | "lg" | "md" | "sm";

const SIZES: Record<HeadingSize, string> = {
	display:
		"text-[clamp(3rem,7.5vw,5rem)] font-bold leading-[1.04] tracking-[-0.025em]",
	xl: "text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.02em]",
	lg: "text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.014em]",
	md: "text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-[1.3] tracking-[-0.008em]",
	sm: "text-[1.0625rem] font-semibold leading-[1.4] tracking-[-0.005em]",
};

/** Default appearance per level, overridable via `size`. */
const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
	1: "xl",
	2: "lg",
	3: "md",
	4: "sm",
};

export type HeadingProps = {
	/** Document outline position. Choose this for structure, not for looks. */
	level?: HeadingLevel;
	/** Visual size. Defaults to the level's own step. */
	size?: HeadingSize;
	className?: string;
	children?: React.ReactNode;
};

export function Heading({
	level = 2,
	size,
	className,
	children,
}: HeadingProps): React.ReactElement {
	const Tag = `h${level}` as const;

	return (
		<Tag
			className={cn(
				"font-display text-ink text-balance",
				SIZES[size ?? DEFAULT_SIZE[level]],
				className
			)}
		>
			{children}
		</Tag>
	);
}

export type EyebrowProps = {
	className?: string;
	children?: React.ReactNode;
};

/** Small uppercase mono metadata above a Botanical display heading. */
export function Eyebrow({
	className,
	children,
}: EyebrowProps): React.ReactElement {
	return (
		<p
			className={cn(
				"font-mono text-xs font-medium uppercase leading-[1.3] tracking-[0.16em] text-ink-muted",
				className
			)}
		>
			{children}
		</p>
	);
}

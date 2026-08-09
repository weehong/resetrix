import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingSize = "display" | "xl" | "lg" | "md" | "sm";

/**
 * The type scale, in Sora.
 *
 * Every step is a `clamp()` rather than a point on a modular scale — the same
 * approach the previous site used, and the reason its headlines held their
 * proportions from phone to desktop instead of stepping at breakpoints. The
 * negative tracking and sub-1 leading are not decoration: Sora at 800 opens up
 * badly at default metrics, and these values are what make it read as a
 * display face.
 */
const SIZES: Record<HeadingSize, string> = {
	display:
		"text-[clamp(2.75rem,8vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em]",
	xl: "text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.035em]",
	lg: "text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em]",
	md: "text-[clamp(1.25rem,2.5vw,1.625rem)] font-bold leading-[1.2] tracking-[-0.02em]",
	sm: "text-lg font-semibold leading-[1.3] tracking-[-0.01em]",
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

/**
 * The small uppercase label that sits above a heading. Inter, not Sora — the
 * previous site set every one of these in the body face with wide tracking,
 * and mixing Sora in at this size just muddies it.
 *
 * Uses `--ink-dim` rather than `--ink-faint`: at 0.75rem the faint step is
 * below the 16px threshold where its 4.80:1 counts as AA.
 */
export function Eyebrow({
	className,
	children,
}: EyebrowProps): React.ReactElement {
	return (
		<p
			className={cn(
				"text-xs font-semibold uppercase tracking-[0.18em] text-ink-dim",
				className
			)}
		>
			{children}
		</p>
	);
}

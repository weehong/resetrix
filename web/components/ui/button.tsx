import { cn } from "@/lib/cn";

export type ButtonVariant = "accent" | "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Every variant pairs a fill with an ink chosen to clear WCAG AA against it —
 * that pairing is the whole reason variants exist as a closed set rather than
 * as loose utility classes on call sites. Ratios are measured, not estimated.
 */
const VARIANTS: Record<ButtonVariant, string> = {
	// Brand cyan cannot carry light text (1.81:1). The dark accent-ink is what
	// makes this fill usable at all — 9.33:1.
	accent: "bg-accent text-accent-ink hover:brightness-95 active:brightness-90",
	// 11.13:1. The high-contrast option when cyan would be too loud.
	solid: "bg-ink text-bg-soft hover:bg-neutral-950",
	// --line-strong, not --line: an operable control's boundary needs 3:1, and
	// the hairline used for dividers is 1.30:1.
	outline:
		"border border-line-strong bg-transparent text-ink hover:bg-bg-inset",
	ghost: "bg-transparent text-ink-dim hover:bg-bg-inset hover:text-ink",
	// 5.41:1 under white. error-600 was the obvious pick and fails at 3.79.
	danger: "bg-danger text-status-ink hover:brightness-95",
};

const SIZES: Record<ButtonSize, string> = {
	sm: "h-9 px-3.5 text-sm gap-1.5",
	md: "h-11 px-5 text-base gap-2",
	lg: "h-13 px-7 text-lg gap-2.5",
};

export type ButtonProps = {
	variant?: ButtonVariant;
	size?: ButtonSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
	variant = "accent",
	size = "md",
	className,
	type = "button",
	...props
}: ButtonProps): React.ReactElement {
	return (
		<button
			type={type}
			className={cn(
				"inline-flex items-center justify-center rounded-(--radius)",
				"font-medium whitespace-nowrap transition",
				"disabled:pointer-events-none disabled:opacity-50",
				VARIANTS[variant],
				SIZES[size],
				className
			)}
			{...props}
		/>
	);
}

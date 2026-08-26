import { cn } from "@/lib/cn";

export type ButtonVariant = "accent" | "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
	accent: "bg-accent text-accent-ink hover:bg-gold-200",
	solid: "bg-cta text-cta-label shadow-(--shadow-xs) hover:bg-cta-hover",
	outline:
		"border border-control bg-surface-raised text-ink shadow-(--shadow-xs) hover:bg-surface-band",
	ghost: "bg-transparent text-ink-soft hover:bg-surface-band hover:text-ink",
	danger:
		"bg-error-700 text-white hover:bg-error-800 dark:bg-error-300 dark:text-error-950 dark:hover:bg-error-400",
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
				"inline-flex items-center justify-center rounded-[14px]",
				"font-medium whitespace-nowrap transition-colors duration-200",
				"disabled:pointer-events-none disabled:bg-forest-400 disabled:text-forest-950 dark:disabled:bg-stone-300",
				VARIANTS[variant],
				SIZES[size],
				className
			)}
			{...props}
		/>
	);
}

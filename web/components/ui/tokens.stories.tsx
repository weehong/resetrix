import type { Meta, StoryObj } from "@storybook/nextjs";

/**
 * Living documentation for the token layer. These stories exist so that a
 * palette change is *visible* rather than something you discover on a page
 * three weeks later — and so the contrast claims in app/tokens.css can be
 * checked by eye against the real rendered colours.
 */

const SCALE_STEPS = [
	"50",
	"100",
	"200",
	"300",
	"400",
	"500",
	"600",
	"700",
	"800",
	"900",
	"950",
] as const;

const FAMILIES = [
	{ name: "primary", note: "crimson — raw scale, no semantic role" },
	{ name: "secondary", note: "lime — raw scale; never adjacent to success" },
	{ name: "tertiary", note: "muted teal — supporting surfaces, not brand" },
	{ name: "info", note: "steel blue — was color-4" },
	{ name: "data", note: "indigo — charts and series colour" },
	{ name: "neutral", note: "warm greys, hue ~17°" },
	{ name: "success", note: "green" },
	{ name: "warning", note: "amber" },
	{ name: "error", note: "orange-red — note, not crimson" },
] as const;

type FamilyName = (typeof FAMILIES)[number]["name"];

/**
 * Tailwind scans source files for complete class strings, so the utilities
 * below cannot be built by interpolation at runtime. This map is the price of
 * that, and it is also a useful check: keying it on FamilyName means a family
 * added above without swatches here is a type error, not a blank row.
 */
const SWATCH_CLASSES: Record<FamilyName, Array<string>> = {
	primary: [
		"bg-primary-50",
		"bg-primary-100",
		"bg-primary-200",
		"bg-primary-300",
		"bg-primary-400",
		"bg-primary-500",
		"bg-primary-600",
		"bg-primary-700",
		"bg-primary-800",
		"bg-primary-900",
		"bg-primary-950",
	],
	secondary: [
		"bg-secondary-50",
		"bg-secondary-100",
		"bg-secondary-200",
		"bg-secondary-300",
		"bg-secondary-400",
		"bg-secondary-500",
		"bg-secondary-600",
		"bg-secondary-700",
		"bg-secondary-800",
		"bg-secondary-900",
		"bg-secondary-950",
	],
	tertiary: [
		"bg-tertiary-50",
		"bg-tertiary-100",
		"bg-tertiary-200",
		"bg-tertiary-300",
		"bg-tertiary-400",
		"bg-tertiary-500",
		"bg-tertiary-600",
		"bg-tertiary-700",
		"bg-tertiary-800",
		"bg-tertiary-900",
		"bg-tertiary-950",
	],
	info: [
		"bg-info-50",
		"bg-info-100",
		"bg-info-200",
		"bg-info-300",
		"bg-info-400",
		"bg-info-500",
		"bg-info-600",
		"bg-info-700",
		"bg-info-800",
		"bg-info-900",
		"bg-info-950",
	],
	data: [
		"bg-data-50",
		"bg-data-100",
		"bg-data-200",
		"bg-data-300",
		"bg-data-400",
		"bg-data-500",
		"bg-data-600",
		"bg-data-700",
		"bg-data-800",
		"bg-data-900",
		"bg-data-950",
	],
	neutral: [
		"bg-neutral-50",
		"bg-neutral-100",
		"bg-neutral-200",
		"bg-neutral-300",
		"bg-neutral-400",
		"bg-neutral-500",
		"bg-neutral-600",
		"bg-neutral-700",
		"bg-neutral-800",
		"bg-neutral-900",
		"bg-neutral-950",
	],
	success: [
		"bg-success-50",
		"bg-success-100",
		"bg-success-200",
		"bg-success-300",
		"bg-success-400",
		"bg-success-500",
		"bg-success-600",
		"bg-success-700",
		"bg-success-800",
		"bg-success-900",
		"bg-success-950",
	],
	warning: [
		"bg-warning-50",
		"bg-warning-100",
		"bg-warning-200",
		"bg-warning-300",
		"bg-warning-400",
		"bg-warning-500",
		"bg-warning-600",
		"bg-warning-700",
		"bg-warning-800",
		"bg-warning-900",
		"bg-warning-950",
	],
	error: [
		"bg-error-50",
		"bg-error-100",
		"bg-error-200",
		"bg-error-300",
		"bg-error-400",
		"bg-error-500",
		"bg-error-600",
		"bg-error-700",
		"bg-error-800",
		"bg-error-900",
		"bg-error-950",
	],
};

const SEMANTIC = [
	{ token: "--bg", swatch: "bg-bg", note: "page — neutral-50 #f8f7f7" },
	{ token: "--bg-soft", swatch: "bg-bg-soft", note: "cards lift off the page" },
	{ token: "--bg-inset", swatch: "bg-bg-inset", note: "wells, code blocks" },
	{ token: "--line", swatch: "bg-line", note: "1.30 — decorative hairline" },
	{
		token: "--line-strong",
		swatch: "bg-line-strong",
		note: "3.12 — operable control boundary",
	},
	{ token: "--ink", swatch: "bg-ink", note: "10.41 AAA" },
	{ token: "--ink-dim", swatch: "bg-ink-dim", note: "6.25 AA, any size" },
	{ token: "--ink-faint", swatch: "bg-ink-faint", note: "4.80 AA at 16px+" },
	{
		token: "--accent",
		swatch: "bg-accent",
		note: "#22d3ee — fills only, 1.69",
	},
	{
		token: "--accent-text",
		swatch: "bg-accent-text",
		note: "#0e7490 — 5.01 AA, links",
	},
	{
		token: "--accent-ink",
		swatch: "bg-accent-ink",
		note: "#04202a — 9.33 on the accent fill",
	},
	{ token: "--success", swatch: "bg-success", note: "6.03 / 6.45 under white" },
	{ token: "--warning", swatch: "bg-warning", note: "4.77 / 5.10 under white" },
	{ token: "--danger", swatch: "bg-danger", note: "5.06 / 5.41 under white" },
] as const;

function Palette(): React.ReactElement {
	return (
		<div className="flex flex-col gap-8 p-8">
			{FAMILIES.map((family) => (
				<div key={family.name}>
					<div className="mb-2 flex items-baseline gap-3">
						<h3 className="font-display text-sm font-bold tracking-[-0.01em] text-ink">
							{family.name}
						</h3>
						<p className="text-xs text-ink-dim">{family.note}</p>
					</div>
					<div className="flex overflow-hidden rounded-(--radius) border border-line">
						{SWATCH_CLASSES[family.name].map((className, index) => (
							<div key={className} className="flex-1">
								<div className={`h-14 ${className}`} />
								<p className="bg-bg-soft py-1 text-center text-[0.625rem] text-ink-faint">
									{SCALE_STEPS[index]}
								</p>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function SemanticTokens(): React.ReactElement {
	return (
		<div className="grid gap-3 p-8 sm:grid-cols-2">
			{SEMANTIC.map((entry) => (
				<div key={entry.token} className="flex items-center gap-3">
					<div
						className={`size-10 shrink-0 rounded-(--radius) border border-line ${entry.swatch}`}
					/>
					<div className="min-w-0">
						<p className="truncate font-mono text-sm text-ink">{entry.token}</p>
						<p className="truncate text-xs text-ink-dim">{entry.note}</p>
					</div>
				</div>
			))}
		</div>
	);
}

function TypeScale(): React.ReactElement {
	return (
		<div className="flex flex-col gap-8 p-8">
			<div>
				<p className="mb-1 text-xs uppercase tracking-[0.18em] text-ink-dim">
					display · Sora 800
				</p>
				<p className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em] text-ink">
					Resetrix
				</p>
			</div>
			<div>
				<p className="mb-1 text-xs uppercase tracking-[0.18em] text-ink-dim">
					xl · Sora 800
				</p>
				<p className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.035em] text-ink">
					A headline that has to hold its shape
				</p>
			</div>
			<div>
				<p className="mb-1 text-xs uppercase tracking-[0.18em] text-ink-dim">
					lg · Sora 700
				</p>
				<p className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
					Section heading
				</p>
			</div>
			<div>
				<p className="mb-1 text-xs uppercase tracking-[0.18em] text-ink-dim">
					md · Sora 700
				</p>
				<p className="font-display text-[clamp(1.25rem,2.5vw,1.625rem)] font-bold leading-[1.2] tracking-[-0.02em] text-ink">
					Subsection heading
				</p>
			</div>
			<div>
				<p className="mb-1 text-xs uppercase tracking-[0.18em] text-ink-dim">
					body · Inter 400
				</p>
				<p className="max-w-prose text-base leading-relaxed text-ink">
					Body copy sets in Inter at a 1.625 line height. The measure is capped
					near 65 characters, which is where the eye stops having to hunt for
					the start of the next line.
				</p>
				<p className="mt-3 max-w-prose text-base leading-relaxed text-ink-dim">
					Secondary copy uses <code>--ink-dim</code> at 6.25:1, which clears AA
					at any size — unlike <code>--ink-faint</code>, which only does so from
					16px up.
				</p>
			</div>
		</div>
	);
}

const meta = {
	title: "Design tokens",
	parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const Palette_: StoryObj = {
	name: "Palette (tier 1)",
	render: () => <Palette />,
};

export const Semantic: StoryObj = {
	name: "Semantic layer (tier 2)",
	render: () => <SemanticTokens />,
};

export const Typography: StoryObj = {
	name: "Type scale",
	render: () => <TypeScale />,
};

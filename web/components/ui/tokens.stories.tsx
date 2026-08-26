import type { Meta, StoryObj } from "@storybook/nextjs";

const STEPS = [
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
	["forest", "primary brand and structure"],
	["stone", "warm neutral and paper"],
	["gold", "signal accent"],
	["chartreuse", "soft highlight"],
	["aqua", "cool counterweight and links"],
	["success", "status only"],
	["warning", "status only"],
	["error", "status only"],
	["info", "status only"],
] as const;

const SEMANTICS = [
	["--surface-base", "Page ground"],
	["--surface-raised", "Raised card"],
	["--surface-band", "Alternating band"],
	["--surface-chip", "Paint-chip band"],
	["--text-primary", "Primary text"],
	["--text-secondary", "Secondary text"],
	["--text-muted", "Muted text"],
	["--text-link", "Accessible link"],
	["--cta-fill", "Primary action"],
	["--accent-fill", "Gold signal"],
	["--highlight", "Highlight sweep"],
	["--focus-ring", "Focus indicator"],
] as const;

function Palette(): React.ReactElement {
	return (
		<div className="flex flex-col gap-8 p-8">
			{FAMILIES.map(([family, note]) => (
				<section key={family}>
					<div className="mb-2 flex items-baseline gap-3">
						<h3 className="font-display text-lg font-semibold text-ink">
							{family}
						</h3>
						<p className="text-xs text-ink-muted">{note}</p>
					</div>
					<div className="flex overflow-hidden rounded-[14px] border border-hairline">
						{STEPS.map((step) => (
							<div key={step} className="min-w-0 flex-1">
								<div
									className="h-14"
									style={{ backgroundColor: `var(--color-${family}-${step})` }}
								/>
								<p className="bg-surface-raised py-1 text-center font-mono text-[0.625rem] text-ink-muted">
									{step}
								</p>
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	);
}

function SemanticTokens(): React.ReactElement {
	return (
		<div className="grid gap-4 bg-surface p-8 sm:grid-cols-2">
			{SEMANTICS.map(([token, label]) => (
				<div
					key={token}
					className="flex items-center gap-3 rounded-[14px] bg-surface-raised p-3"
				>
					<div
						className="size-10 rounded-[10px] border border-hairline"
						style={{ backgroundColor: `var(${token})` }}
					/>
					<div>
						<p className="font-mono text-sm text-ink">{token}</p>
						<p className="text-xs text-ink-muted">{label}</p>
					</div>
				</div>
			))}
		</div>
	);
}

function TypeScale(): React.ReactElement {
	return (
		<div className="space-y-8 bg-surface p-8 text-ink">
			<div>
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
					Display · Fraunces 700
				</p>
				<p className="mt-2 font-display text-[clamp(3rem,7.5vw,5rem)] font-bold leading-[1.04] tracking-[-0.025em]">
					Resetrix
				</p>
			</div>
			<div>
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
					Section · Fraunces 600
				</p>
				<p className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
					A clearer way forward
				</p>
			</div>
			<div>
				<p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
					Body · Inter 400
				</p>
				<p className="mt-2 max-w-[68ch] leading-[1.72] text-ink-soft">
					Neutral body type gives the organic display face room to carry the
					Botanical character.
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
	name: "Botanical ramps",
	render: () => <Palette />,
};
export const Semantic: StoryObj = {
	name: "Light and dark semantics",
	render: () => <SemanticTokens />,
};
export const Typography: StoryObj = {
	name: "Typography",
	render: () => <TypeScale />,
};

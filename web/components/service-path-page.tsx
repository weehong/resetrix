"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Link2, PlugZap, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { Brand, ThemeSwitcher } from "@/components/marketing-shared";

export type PathType = "transformation" | "customisation";

type ServiceContent = {
	readonly eyebrow: string;
	readonly title: ReactNode;
	readonly lede: string;
	readonly sibling: string;
	readonly siblingHref: string;
	readonly signalsTitle: string;
	readonly signalsIntro: string;
	readonly signals: ReadonlyArray<readonly [string, string, string]>;
	readonly method: ReadonlyArray<readonly [string, string]>;
	readonly evidenceLabel: string;
	readonly evidenceTitle: string;
	readonly evidenceNodes: ReadonlyArray<readonly [string, string]>;
	readonly evidenceOutcome: string;
	readonly endBody: string;
};

const CONTENT: Record<PathType, ServiceContent> = {
	transformation: {
		eyebrow: "Transform the operation",
		title: (
			<>
				Fix the operational bottleneck before buying{" "}
				<span className="highlight">more tools.</span>
			</>
		),
		lede: "Your team relies on spreadsheets, chat and manual hand-offs, and it is no longer clear which part is holding growth back. We map the operation first, then recommend the least-complex change that moves a business measure.",
		sibling: "Make your software fit",
		siblingHref: "/software-customisation",
		signalsTitle: "The signals that bring SMEs here.",
		signalsIntro:
			"One persistent constraint that costs real capacity is enough to justify a clearer decision.",
		signals: [
			[
				"01",
				"Work lives in inboxes",
				"Jobs, approvals and status updates are coordinated across chat groups and email threads rather than a system.",
			],
			[
				"02",
				"The same data, re-entered",
				"A single order or job is typed into three or four places before it is complete.",
			],
			[
				"03",
				"No trusted view",
				"Management reporting is rebuilt by hand each week, and two people can produce two different numbers.",
			],
			[
				"04",
				"Growth adds headcount",
				"Winning more work means hiring more coordinators rather than serving more customers with the same team.",
			],
			[
				"05",
				"Nobody owns the process",
				"Exceptions are resolved by whoever is available, so the workflow is different every time.",
			],
			[
				"06",
				"Improvement never sticks",
				"Past fixes were abandoned because no baseline or owner was agreed before the change.",
			],
		],
		method: [
			[
				"Rethink",
				"Map the workflow as it actually runs, including the exceptions and workarounds nobody documents, then agree a baseline measure.",
			],
			[
				"Rework",
				"Replace the workaround by configuring, connecting or extending the least-complex system that can move the measure.",
			],
			[
				"Refocus",
				"Move coordination and reporting onto the system, so leadership can return its attention to the business.",
			],
		],
		evidenceLabel: "Operational signal map",
		evidenceTitle: "Make the drag visible before you change it.",
		evidenceNodes: [
			["People", "owner named"],
			["Handoffs", "exceptions mapped"],
			["Data", "baseline agreed"],
		],
		evidenceOutcome: "Capacity measure selected",
		endBody:
			"A 20-minute call is enough for us to say whether a System Fit Diagnostic is the right next step, or whether something simpler will do.",
	},
	customisation: {
		eyebrow: "Make your software fit",
		title: (
			<>
				Keep the tools that work. Customise the{" "}
				<span className="highlight">gaps that do not.</span>
			</>
		),
		lede: "You already pay for SaaS and business systems. The problem is the space between them: workarounds, duplicate data and workflows your team has to fight. We close those gaps without asking you to abandon the stack.",
		sibling: "Transform the operation",
		siblingHref: "/operational-transformation",
		signalsTitle: "When good software stops fitting.",
		signalsIntro:
			"One recurring system gap that costs real capacity is enough to justify a clearer technical and operational decision.",
		signals: [
			[
				"01",
				"The workaround is the process",
				"A spreadsheet sits beside the system because it cannot express how your business quotes, schedules or bills.",
			],
			[
				"02",
				"Two systems, one truth",
				"The same customer or order exists in both, and reconciling them is somebody's weekly job.",
			],
			[
				"03",
				"Reporting leaves the tool",
				"Numbers are exported to a spreadsheet before anyone can act on them.",
			],
			[
				"04",
				"The plan does not fit the need",
				"You are paying for an enterprise tier to unlock one field, rule or integration.",
			],
			[
				"05",
				"Customers feel the seams",
				"Status, documents or approvals have to be relayed by staff because no portal exposes them.",
			],
			[
				"06",
				"Nobody will touch it",
				"The system works, but changing it feels risky, so the team adapts around it instead.",
			],
		],
		method: [
			[
				"Configure & connect",
				"First exhaust what your existing tools can already do, then integrate them so data and work stop getting lost between them.",
			],
			[
				"Extend",
				"Where a real gap remains, build around the product you keep: the missing rule, field, workflow, document or portal.",
			],
			[
				"Replace only if needed",
				"Replace a tool only when evidence shows it genuinely cannot carry the operation, not as a default.",
			],
		],
		evidenceLabel: "System-fit panel",
		evidenceTitle: "Keep each system useful. Close the gap between them.",
		evidenceNodes: [
			["Core tools", "retain"],
			["Data hand-offs", "connect"],
			["Fit layer", "extend"],
		],
		evidenceOutcome: "One trusted operating flow",
		endBody:
			"A 20-minute call is enough for us to say whether the gap is a configuration question, an integration question or a genuine build.",
	},
};

const METHOD_ICONS = [Settings2, Link2, PlugZap] as const;

export function ServicePathPage({
	type,
}: {
	readonly type: PathType;
}): React.ReactElement {
	const content = CONTENT[type];
	const endTitle =
		type === "transformation" ? (
			<>
				Bring us the workflow that is{" "}
				<span className="highlight">holding growth back.</span>
			</>
		) : (
			<>
				Tell us which tool your team is{" "}
				<span className="highlight">working around.</span>
			</>
		);

	return (
		<div className="site-shell service-page">
			<header className="service-nav">
				<nav className="container nav" aria-label="Primary navigation">
					<Brand />
					<div className="nav-links">
						<Link href="/operational-transformation">
							Transform the operation
						</Link>
						<Link href="/software-customisation">Customise software</Link>
						<Link href="/#method">Method</Link>
					</div>
					<div className="nav-actions">
						<ThemeSwitcher />
						<Link className="btn btn--accent" href="/#contact">
							Book a fit call <ArrowRight size={16} />
						</Link>
					</div>
					<Link className="service-mobile-cta" href="/#contact">
						Fit call
					</Link>
				</nav>
			</header>
			<main>
				<section className="service-hero">
					<div
						className={`container service-hero-grid service-hero-grid--${type}`}
					>
						<div>
							<Link className="service-back" href="/">
								<ArrowLeft size={15} /> Back to all services
							</Link>
							<p className="eyebrow">{content.eyebrow}</p>
							<h1 className="display-xl">{content.title}</h1>
							<p className="body-lg">{content.lede}</p>
							<div className="hero-actions">
								<Link className="btn btn--accent" href="/#contact">
									Book a System Fit Call <ArrowRight size={17} />
								</Link>
								<Link className="btn btn--outline" href={content.siblingHref}>
									{content.sibling} <ArrowRight size={17} />
								</Link>
							</div>
						</div>
						<aside
							className="evidence-panel"
							aria-label={content.evidenceLabel}
						>
							<p className="eyebrow">{content.evidenceLabel}</p>
							<h2>{content.evidenceTitle}</h2>
							<div className="evidence-map">
								{content.evidenceNodes.map(([label, state]) => (
									<div className="evidence-node" key={label}>
										<span />
										<b>{label}</b>
										<em>{state}</em>
									</div>
								))}
							</div>
							<div className="evidence-outcome">
								<span />
								<p>{content.evidenceOutcome}</p>
								<ArrowRight size={16} />
							</div>
						</aside>
					</div>
				</section>
				<section className="section surface-band">
					<div className="container">
						<div className="service-section-heading">
							<p className="eyebrow">Know the signal</p>
							<h2 className="display-lg">{content.signalsTitle}</h2>
							<p className="body-lg">{content.signalsIntro}</p>
						</div>
						<div className="service-signal-grid">
							{content.signals.map(([number, title, copy]) => (
								<article className="service-signal" key={title}>
									<span>{number}</span>
									<h3>{title}</h3>
									<p>{copy}</p>
								</article>
							))}
						</div>
					</div>
				</section>
				<section className="section">
					<div className="container">
						<p className="eyebrow">How we change it</p>
						<h2 className="display-lg">
							A controlled change, not an open-ended{" "}
							<span className="highlight">feature list.</span>
						</h2>
						<div className="service-method-grid">
							{content.method.map(([title, copy], index) => {
								const Icon = METHOD_ICONS[index];
								return Icon ? (
									<article key={title}>
										<span className="service-method-icon">
											<Icon size={22} />
										</span>
										<h3>{title}</h3>
										<p>{copy}</p>
									</article>
								) : null;
							})}
						</div>
					</div>
				</section>
				<section className="section section--tight">
					<div className="container">
						<div className="diagnostic-panel">
							<div>
								<p className="eyebrow">Where this starts</p>
								<h2 className="display-lg">
									The System Fit <span className="highlight">Diagnostic.</span>
								</h2>
								<p>
									Ten business days on one workflow and the stack behind it.
									Leave with a current-state map, a baseline, a costed
									bottleneck and a clear configure, connect, extend or replace
									decision.
								</p>
								<Link className="btn btn--accent" href="/#contact">
									Request a System Fit Call <ArrowRight size={16} />
								</Link>
							</div>
							<div className="diagnostic-rows">
								<p>
									<span>Timeline</span>
									<b>10 business days</b>
								</p>
								<p>
									<span>Focus</span>
									<b>One workflow + current stack</b>
								</p>
								<p>
									<span>Output</span>
									<b>A clear next decision</b>
								</p>
								<p>
									<span>Investment</span>
									<b>S$2,800 + GST</b>
								</p>
							</div>
						</div>
					</div>
				</section>
				<section className="service-end">
					<div className="container">
						<p className="eyebrow">Start with the stuck work</p>
						<h2 className="display-lg">{endTitle}</h2>
						<p className="body-lg">{content.endBody}</p>
						<Link className="btn btn--primary" href="/#contact">
							Book a System Fit Call <ArrowRight size={16} />
						</Link>
					</div>
				</section>
			</main>
		</div>
	);
}

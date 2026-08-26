import type { Metadata } from "next";
import { AppearanceSelector } from "@/components/appearance-selector";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
	title: {
		absolute: "Resetrix | Software that fits the way your business works",
	},
	description: siteConfig.description,
	alternates: { canonical: "/" },
	openGraph: {
		title: "Resetrix | Re-think. Re-work. Re-focus.",
		description: siteConfig.description,
		url: "/",
	},
};

const SERVICES = [
	{
		number: "01",
		title: "Digital transformation",
		body: "Move from traditional processes toward modern digital operations with a clear, practical path forward.",
		icon: "path",
	},
	{
		number: "02",
		title: "Software customization",
		body: "Build end-to-end software around your business model instead of forcing your team into a generic template.",
		icon: "blocks",
	},
	{
		number: "03",
		title: "Digital consultancy",
		body: "Shape a roadmap for scaling, improving systems, and introducing new technology with purpose.",
		icon: "compass",
	},
	{
		number: "04",
		title: "Responsive support",
		body: "Keep momentum after launch with reliable support and a partner who stays close to the work.",
		icon: "support",
	},
] as const;

const STEPS = [
	{
		number: "1",
		title: "Re-think",
		body: "Start with the operation, the friction, and the outcome that matters.",
	},
	{
		number: "2",
		title: "Re-work",
		body: "Design and build a focused system around how the business really runs.",
	},
	{
		number: "3",
		title: "Re-focus",
		body: "Support the change, learn from real use, and keep the next move clear.",
	},
] as const;

function ArrowIcon(): React.ReactElement {
	return (
		<svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none">
			<path
				d="M4 10h12m-5-5 5 5-5 5"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ServiceIcon({ name }: { name: string }): React.ReactElement {
	const paths: Record<string, React.ReactNode> = {
		path: <path d="M5 18C5 11 19 13 19 6M15 6h4v4M7 6H5a2 2 0 0 0-2 2v2" />,
		blocks: (
			<>
				<rect x="3" y="3" width="7" height="7" rx="2" />
				<rect x="14" y="3" width="7" height="7" rx="2" />
				<rect x="3" y="14" width="7" height="7" rx="2" />
				<path d="M17.5 14v7M14 17.5h7" />
			</>
		),
		compass: (
			<>
				<circle cx="12" cy="12" r="9" />
				<path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
			</>
		),
		support: (
			<>
				<path d="M4 13v-2a8 8 0 0 1 16 0v2" />
				<path d="M6 17H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h1v5Zm12 0h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1v5ZM18 17c0 2-2 3-5 3" />
			</>
		),
	};

	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="size-6"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{paths[name]}
		</svg>
	);
}

function Wordmark(): React.ReactElement {
	return (
		<Link
			href="#top"
			tone="quiet"
			className="font-display text-xl font-semibold tracking-[-0.02em]"
		>
			Resetrix<span className="text-gold-700 dark:text-gold-300">.</span>
		</Link>
	);
}

export default function Home(): React.ReactElement {
	return (
		<div id="top" className="min-h-screen overflow-hidden bg-surface text-ink">
			<header className="sticky top-0 z-50 border-b border-hairline bg-[color-mix(in_oklab,var(--surface-base)_82%,transparent)] backdrop-blur-xl">
				<Container
					as="div"
					className="flex h-[72px] items-center justify-between gap-3"
				>
					<Wordmark />
					<nav
						aria-label="Primary"
						className="hidden items-center gap-8 md:flex"
					>
						<Link
							href="#services"
							tone="quiet"
							className="text-sm font-medium text-ink-soft"
						>
							What we do
						</Link>
						<Link
							href="#approach"
							tone="quiet"
							className="text-sm font-medium text-ink-soft"
						>
							How we work
						</Link>
						<Link
							href="#about"
							tone="quiet"
							className="text-sm font-medium text-ink-soft"
						>
							Why Resetrix
						</Link>
					</nav>
					<AppearanceSelector />
				</Container>
			</header>

			<main>
				<section className="relative flex min-h-[calc(100svh-72px)] items-center py-20 lg:py-24">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -left-32 top-8 size-[28rem] rounded-full bg-forest-300/20 blur-[140px] dark:bg-forest-700/25"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-24 bottom-0 size-[24rem] rounded-full bg-gold-200/10 blur-[140px] dark:bg-gold-400/10"
					/>
					<Container className="relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
						<div className="max-w-3xl">
							<Eyebrow className="hero-reveal">
								Software studio for SMEs
							</Eyebrow>
							<Heading
								level={1}
								size="display"
								className="hero-reveal mt-3 [animation-delay:120ms]"
							>
								Software that fits the way your business{" "}
								<mark className="rounded-[6px] bg-highlight px-2 text-forest-950 box-decoration-clone">
									works.
								</mark>
							</Heading>
							<p className="hero-reveal mt-6 max-w-[56ch] text-[1.1875rem] leading-[1.7] text-ink-soft [animation-delay:240ms]">
								Resetrix helps small and medium-sized businesses rethink
								operations, build software around real needs, and move through
								digital change with practical support.
							</p>
							<div className="hero-reveal mt-10 flex flex-col items-start gap-3 sm:flex-row [animation-delay:360ms]">
								<Link
									href="#services"
									tone="quiet"
									className="inline-flex h-[52px] items-center gap-2 rounded-[14px] bg-accent px-8 font-semibold text-accent-ink transition-colors hover:bg-gold-200"
								>
									Explore what we do <ArrowIcon />
								</Link>
								<Link
									href="#approach"
									tone="quiet"
									className="inline-flex h-[52px] items-center rounded-[14px] px-6 font-semibold text-ink-soft transition-colors hover:bg-surface-band hover:text-ink"
								>
									Our approach
								</Link>
							</div>
							<p className="hero-reveal mt-10 flex items-center gap-3 text-sm text-ink-muted [animation-delay:480ms]">
								<span
									aria-hidden="true"
									className="h-px w-10 bg-forest-600 dark:bg-forest-400"
								/>
								Custom systems. Clear guidance. Long-term partnership.
							</p>
						</div>

						<div
							aria-hidden="true"
							className="hero-reveal relative mx-auto w-full max-w-[540px] [animation-delay:300ms]"
						>
							<div className="absolute -inset-6 -rotate-3 rounded-[40px] bg-stone-200 dark:bg-forest-800" />
							<div className="relative rounded-[28px] border border-hairline bg-surface-raised p-5 shadow-(--shadow-md) sm:p-7 dark:shadow-none">
								<div className="flex items-center justify-between border-b border-hairline pb-5">
									<div>
										<p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
											Operational view
										</p>
										<p className="mt-1 font-display text-xl font-semibold">
											A clearer way forward
										</p>
									</div>
									<span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">
										In focus
									</span>
								</div>
								<div className="mt-6 grid gap-4 sm:grid-cols-2">
									<div className="rounded-[20px] bg-surface-band p-5 sm:row-span-2">
										<p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
											Current process
										</p>
										<div className="mt-7 space-y-5">
											{["Understand", "Simplify", "Build"].map(
												(label, index) => (
													<div key={label} className="flex items-center gap-3">
														<span
															className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold ${index === 0 ? "bg-forest-800 text-stone-50 dark:bg-forest-300 dark:text-forest-950" : "border border-control text-ink-muted"}`}
														>
															{index + 1}
														</span>
														<span className="text-sm font-medium">{label}</span>
													</div>
												)
											)}
										</div>
									</div>
									<div className="rounded-[20px] bg-chip p-5">
										<p className="text-xs text-ink-muted dark:text-aqua-300">
											Systems aligned
										</p>
										<p className="mt-2 font-display text-3xl font-semibold text-forest-950 dark:text-stone-100">
											One view
										</p>
									</div>
									<div className="rounded-[20px] bg-forest-800 p-5 text-stone-50">
										<p className="text-xs text-stone-300">Next decision</p>
										<p className="mt-2 font-display text-lg font-semibold">
											Made with context
										</p>
									</div>
								</div>
							</div>
						</div>
					</Container>
				</section>

				<section
					id="services"
					className="bg-surface-band py-24 lg:py-32 scroll-mt-20"
				>
					<Container>
						<div className="max-w-3xl">
							<Eyebrow>What we do</Eyebrow>
							<Heading level={2} size="xl" className="mt-3">
								Make digital change useful, not theatrical.
							</Heading>
							<p className="mt-5 max-w-[56ch] text-[1.1875rem] leading-[1.7] text-ink-soft">
								From the first roadmap to the software and support that follow,
								the work stays grounded in your operating reality.
							</p>
						</div>
						<ul className="mt-12 grid gap-8 md:grid-cols-2">
							{SERVICES.map((service, index) => (
								<Card
									as="li"
									key={service.title}
									accent={index === 0}
									className="group transition-[transform,box-shadow] duration-300 ease-(--ease-organic) hover:-translate-y-1 hover:shadow-(--shadow-md)"
								>
									<div className="flex items-start justify-between gap-4">
										<span className="flex size-12 items-center justify-center rounded-[14px] bg-aqua-200 text-forest-950 dark:bg-aqua-300/15 dark:text-aqua-300">
											<ServiceIcon name={service.icon} />
										</span>
										<span className="font-mono text-xs tracking-[0.16em] text-ink-muted">
											{service.number}
										</span>
									</div>
									<CardTitle className="mt-8">{service.title}</CardTitle>
									<CardBody className="max-w-[52ch]">{service.body}</CardBody>
								</Card>
							))}
						</ul>
					</Container>
				</section>

				<section id="approach" className="py-24 lg:py-32 scroll-mt-20">
					<Container>
						<div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
							<div>
								<Eyebrow>How we work</Eyebrow>
								<Heading level={2} size="xl" className="mt-3">
									Reset before you rebuild.
								</Heading>
								<p className="mt-5 text-lg leading-[1.7] text-ink-soft">
									The name Resetrix reflects a collaborative approach: begin
									with a fresh view, then shape a flexible system together.
								</p>
							</div>
							<ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
								<div
									aria-hidden="true"
									className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-px bg-hairline md:left-5 md:right-5 md:h-px md:w-auto"
								/>
								{STEPS.map((step) => (
									<li
										key={step.number}
										className="relative pl-16 md:pl-0 md:pt-16"
									>
										<span className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full bg-accent font-display text-lg font-semibold text-accent-ink ring-4 ring-[var(--surface-base)]">
											{step.number}
										</span>
										<Heading level={3} size="md">
											{step.title}
										</Heading>
										<p className="mt-3 text-[0.9375rem] leading-[1.6] text-ink-soft">
											{step.body}
										</p>
									</li>
								))}
							</ol>
						</div>
					</Container>
				</section>

				<section id="about" className="scroll-mt-20 py-8 lg:py-12">
					<Container width="wide">
						<div className="relative overflow-hidden rounded-[40px] bg-forest-800 px-6 py-20 text-stone-50 md:px-12 lg:px-20 lg:py-24">
							<div
								aria-hidden="true"
								className="absolute -right-20 -top-32 size-96 rounded-full border-[72px] border-forest-700"
							/>
							<div className="relative grid items-end gap-12 lg:grid-cols-[1fr_auto]">
								<div className="max-w-3xl">
									<p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-stone-300">
										Why Resetrix
									</p>
									<Heading level={2} size="xl" className="mt-3 text-stone-50">
										Built for partnership, not hand-off.
									</Heading>
									<p className="mt-5 max-w-[56ch] text-lg leading-[1.7] text-stone-200">
										We believe strong software comes from understanding the
										business behind it. That means transparent collaboration,
										solutions shaped to fit, and support for what comes next.
									</p>
								</div>
								<div className="rounded-[20px] bg-stone-50 p-6 text-forest-950 lg:max-w-[280px]">
									<p className="font-display text-2xl font-semibold">
										Re-think.
										<br />
										Re-work.
										<br />
										<span className="text-gold-700">Re-focus.</span>
									</p>
									<p className="mt-4 text-sm leading-relaxed text-stone-800">
										A practical rhythm for lasting digital change.
									</p>
								</div>
							</div>
						</div>
					</Container>
				</section>

				<section className="py-24 lg:py-32">
					<Container>
						<div className="rounded-[40px] bg-surface-chip px-6 py-16 text-center text-forest-950 md:px-12 md:py-20 dark:text-stone-100">
							<Eyebrow className="text-stone-800 dark:text-stone-300">
								A better starting point
							</Eyebrow>
							<Heading
								level={2}
								size="xl"
								className="mx-auto mt-3 max-w-[16ch] text-forest-950 dark:text-stone-100"
							>
								Start with the business. Build what it needs.
							</Heading>
							<Link
								href="#services"
								tone="quiet"
								className="mt-8 inline-flex h-[52px] items-center gap-2 rounded-[14px] bg-accent px-8 font-semibold text-accent-ink transition-colors hover:bg-gold-200"
							>
								See our capabilities <ArrowIcon />
							</Link>
						</div>
					</Container>
				</section>
			</main>

			<footer className="border-t border-hairline bg-stone-100 py-16 text-forest-950 dark:bg-forest-950 dark:text-stone-100">
				<Container>
					<div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:gap-16">
						<div>
							<Wordmark />
							<p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-800 dark:text-stone-300">
								Software and digital guidance shaped around the way SMEs work.
							</p>
						</div>
						<div>
							<p className="text-sm font-semibold">Explore</p>
							<div className="mt-3 flex flex-col gap-2 text-sm text-stone-800 dark:text-stone-300">
								<Link href="#services" tone="quiet">
									What we do
								</Link>
								<Link href="#approach" tone="quiet">
									How we work
								</Link>
							</div>
						</div>
						<div>
							<p className="text-sm font-semibold">Resetrix</p>
							<div className="mt-3 flex flex-col gap-2 text-sm text-stone-800 dark:text-stone-300">
								<Link href="#about" tone="quiet">
									Our approach
								</Link>
								<Link href="#top" tone="quiet">
									Back to top
								</Link>
							</div>
						</div>
					</div>
					<div className="mt-12 border-t border-hairline pt-6 text-xs text-stone-700 dark:text-stone-400">
						© {new Date().getFullYear()} Resetrix. Re-think. Re-work. Re-focus.
					</div>
				</Container>
			</footer>
		</div>
	);
}

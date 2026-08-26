"use client";

import Link from "next/link";
import {
	ArrowRight,
	BarChart3,
	Check,
	ChevronRight,
	CircleDot,
	Database,
	FlaskConical,
	Layers3,
	Menu,
	Network,
	Plus,
	Settings2,
	TimerReset,
	UsersRound,
	Workflow,
	X,
	Zap,
} from "lucide-react";
import {
	useEffect,
	useRef,
	useState,
	type FormEvent,
	type ReactNode,
} from "react";
import { Brand, ThemeSwitcher } from "@/components/marketing-shared";

const PAINS = [
	{
		Icon: Layers3,
		title: "Manual operations",
		copy: "Your team re-enters the same data across spreadsheets, WhatsApp, email and multiple systems.",
	},
	{
		Icon: TimerReset,
		title: "Delays and errors",
		copy: "Work slows down because quotes, approvals or updates pass through too many hands.",
	},
	{
		Icon: BarChart3,
		title: "No reliable view",
		copy: "Management cannot see a trusted real-time picture of jobs, orders or capacity.",
	},
	{
		Icon: UsersRound,
		title: "Scaling constraint",
		copy: "The business can win more work, but operations cannot scale without more manual effort.",
	},
	{
		Icon: FlaskConical,
		title: "AI uncertainty",
		copy: "You see AI potential, but the process and data are too fragmented to use it safely.",
	},
] as const;

const DECISIONS = [
	{
		Icon: Settings2,
		title: "Configure",
		copy: "Use the native features, roles and rules you already pay for when standard workflows are enough.",
	},
	{
		Icon: Network,
		title: "Connect",
		copy: "Integrate the tools you already rely on, so work and data stop getting lost between them.",
	},
	{
		Icon: Zap,
		title: "Automate",
		copy: "Remove repetitive hand-offs, chasing and re-entry from high-volume workflows.",
	},
	{
		Icon: Database,
		title: "Extend",
		copy: "Close the gaps around the SaaS products you keep with a portal, workflow layer or focused custom build.",
	},
	{
		Icon: Layers3,
		title: "Replace",
		copy: "Build purpose-made software only when evidence shows the current system cannot carry the operation.",
	},
] as const;

const OFFERS = [
	{
		kicker: "01 / Decide",
		title: "Operational Clarity Diagnostic",
		copy: "Find the workflow that is costing you time, visibility or capacity, and get a practical plan to fix it.",
		timeline: "10 business days",
		focus: "One key workflow",
		investment: "S$2,800 + GST",
		featured: true,
		items: [
			"Current workflow and systems map",
			"Baseline KPI and bottleneck analysis",
			"Configure, integrate or build recommendation",
			"Prioritised 90-day action plan",
		],
		cta: "Book a fit call",
		note: "100% credited against a qualifying Resetrix implementation started within 30 days.",
	},
	{
		kicker: "02 / Improve",
		title: "90-Day Workflow Sprint",
		copy: "Fix one operational bottleneck without committing to a multi-year transformation programme.",
		timeline: "Up to 90 days",
		focus: "One workflow + KPI",
		investment: "S$18k-45k + GST",
		featured: false,
		items: [
			"Focused build or configuration",
			"Up to two priority integrations",
			"Training, go-live and hypercare",
			"30/60/90-day value review",
		],
		cta: "See if your workflow fits",
		note: "Best for delayed quoting, manual re-entry and service coordination.",
	},
	{
		kicker: "03 / Scale",
		title: "Connected Operations Build",
		copy: "Connect the systems, data and workflows your business depends on without replacing everything at once.",
		timeline: "8-12 week modules",
		focus: "Multi-team operations",
		investment: "From S$60k + GST",
		featured: false,
		items: [
			"Multi-system integration and data model",
			"Role-based web or mobile workflows",
			"Operational dashboards and governance",
			"Milestone-based proceed, adjust or stop gates",
		],
		cta: "Discuss a Connected Build",
		note: "Best for leadership-aligned SMEs with disconnected systems and a real need to scale.",
	},
] as const;

const FAQS = [
	[
		"What happens in the Operational Clarity Diagnostic?",
		"We focus on one operational workflow. You receive a current-state workflow and systems map, a baseline KPI, a bottleneck and risk analysis, a future-state recommendation, and a practical 90-day action plan.",
	],
	[
		"Will you recommend software even if we do not need it?",
		"No. The diagnostic can recommend configuring an existing platform, connecting systems you already use, automating a limited step, or building purpose-made software.",
	],
	[
		"How do we know a Workflow Sprint is a fit?",
		"A good Sprint has one operational bottleneck, a business owner, a measurable baseline and a willing group of users. It is not designed for an undefined feature backlog or a complete ERP replacement.",
	],
	[
		"Do you support the system after launch?",
		"Yes. Transformation Care covers maintenance, support triage, adoption reviews, security upkeep and a planned improvement roadmap.",
	],
] as const;

function Reveal({
	children,
}: {
	readonly children: ReactNode;
}): React.ReactElement {
	const elementRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const element = elementRef.current;
		if (
			!element ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
			typeof IntersectionObserver === "undefined"
		) {
			setVisible(true);
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 }
		);
		observer.observe(element);
		return (): void => {
			observer.disconnect();
		};
	}, []);

	return (
		<div ref={elementRef} className={`reveal ${visible ? "is-visible" : ""}`}>
			{children}
		</div>
	);
}

function OperationalIllustration({
	variant = "map",
	label,
}: {
	readonly variant?: "map" | "connected" | "care" | "sprint";
	readonly label: string;
}): React.ReactElement {
	return (
		<div
			className={`operations-illustration operations-illustration--${variant}`}
			role="img"
			aria-label={label}
		>
			<span className="illustration-orbit" />
			<span className="illustration-grid" />
			<span className="illustration-node illustration-node--one" />
			<span className="illustration-node illustration-node--two" />
			<span className="illustration-node illustration-node--three" />
		</div>
	);
}

export function MarketingHome(): React.ReactElement {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [contactStatus, setContactStatus] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");

	useEffect(() => {
		const handleScroll = (): void => {
			setScrolled(window.scrollY > 80);
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return (): void => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "";
		return (): void => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	const goContact = (): void => {
		setMenuOpen(false);
		document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
	};

	const submitContact = async (
		event: FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault();
		const formElement = event.currentTarget;
		setContactStatus("submitting");

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Object.fromEntries(new FormData(formElement))),
			});
			if (!response.ok) {
				throw new Error("Contact request failed");
			}
			formElement.reset();
			setContactStatus("success");
		} catch {
			setContactStatus("error");
		}
	};

	return (
		<div className="site-shell">
			<header className={`nav-shell ${scrolled ? "is-scrolled" : ""}`}>
				<nav className="container nav" aria-label="Primary navigation">
					<Brand href="#top" />
					<div className="nav-links">
						<Link href="/operational-transformation">Transform operations</Link>
						<Link href="/software-customisation">Customise software</Link>
						<a href="#method">Method</a>
						<a href="#faq">FAQ</a>
					</div>
					<div className="nav-actions">
						<ThemeSwitcher />
						<button
							className="btn btn--accent"
							type="button"
							onClick={goContact}
						>
							Book a fit call <ArrowRight size={16} />
						</button>
					</div>
					<button
						className="menu-toggle"
						type="button"
						onClick={() => {
							setMenuOpen((value) => !value);
						}}
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						aria-expanded={menuOpen}
					>
						{menuOpen ? <X size={22} /> : <Menu size={22} />}
					</button>
				</nav>
			</header>
			<div
				className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
				aria-hidden={!menuOpen}
			>
				<Link href="/operational-transformation">Transform operations</Link>
				<Link href="/software-customisation">Customise software</Link>
				<a
					href="#method"
					onClick={() => {
						setMenuOpen(false);
					}}
				>
					Method
				</a>
				<a
					href="#offers"
					onClick={() => {
						setMenuOpen(false);
					}}
				>
					Offers
				</a>
				<a
					href="#faq"
					onClick={() => {
						setMenuOpen(false);
					}}
				>
					FAQ
				</a>
				<ThemeSwitcher />
				<button className="btn btn--accent" type="button" onClick={goContact}>
					Book a fit call <ArrowRight size={16} />
				</button>
			</div>

			<main id="top">
				<section className="hero" aria-labelledby="hero-title">
					<div className="container hero-grid">
						<div className="hero-copy">
							<p className="eyebrow">
								For Singapore SMEs outgrowing one-size-fits-all software
							</p>
							<h1 id="hero-title" className="display-xl">
								Does your software fit the way your business{" "}
								<span className="highlight">actually works?</span>
							</h1>
							<p className="body-lg">
								Whether you are fixing a fragmented operation or extending the
								tools you already use, Resetrix finds the least-complex route to
								a workflow that fits.
							</p>
							<div className="hero-actions">
								<button
									className="btn btn--accent"
									type="button"
									onClick={goContact}
								>
									Book a 20-minute fit call <ArrowRight size={17} />
								</button>
								<a className="btn btn--ghost" href="#method">
									See how we decide <ChevronRight size={17} />
								</a>
							</div>
							<div className="hero-proof">
								<span className="proof-node">
									<CircleDot size={16} />
								</span>
								<span>
									One workflow. One business owner. One measurable outcome.
								</span>
							</div>
						</div>
						<div className="hero-art">
							<span className="hero-tag">
								<i />
								Signal found
							</span>
							<div className="hero-photo-wrap">
								<OperationalIllustration label="Abstract operational planning workspace" />
							</div>
							<div className="operating-map">
								<p>Operational signal map</p>
								<div className="map-track">
									<div className="map-node">
										<UsersRound size={13} />
										<span>People</span>
										<em>owner</em>
									</div>
									<div className="map-node">
										<Network size={13} />
										<span>Systems</span>
										<em>connected</em>
									</div>
									<div className="map-node">
										<Database size={13} />
										<span>Data</span>
										<em>trusted</em>
									</div>
									<div className="map-node map-node--outcome">
										<BarChart3 size={13} />
										<span>Outcome</span>
										<em>measured</em>
									</div>
								</div>
							</div>
							<div className="signal-card">
								<p className="eyebrow">The Resetrix method</p>
								<strong>Find what costs you capacity.</strong>
								<div className="signal-flow">
									<span>Workflow</span>
									<b>→</b>
									<span>System</span>
									<b>→</b>
									<span>Outcome</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="path-selector" aria-labelledby="path-title">
					<div className="container">
						<Reveal>
							<p className="eyebrow">Where are you starting from?</p>
							<h2 id="path-title" className="display-lg">
								Two situations. One place to{" "}
								<span className="highlight">start.</span>
							</h2>
							<p className="body-lg">
								The starting problem differs. Either way, we diagnose the
								workflow, current stack, data and business outcome before
								proposing a route.
							</p>
						</Reveal>
						<div className="path-grid">
							<Link className="path-card" href="/operational-transformation">
								<span className="path-number">01</span>
								<span className="path-icon">
									<Workflow size={25} />
								</span>
								<h3>Transform the operation</h3>
								<p>
									Your team relies on spreadsheets, chat and manual hand-offs,
									and you need to identify what is holding growth back.
								</p>
								<span className="path-link">
									Map the operation <ArrowRight size={16} />
								</span>
							</Link>
							<Link
								className="path-card path-card--software"
								href="/software-customisation"
							>
								<span className="path-number">02</span>
								<span className="path-icon">
									<Settings2 size={25} />
								</span>
								<h3>Make your software fit</h3>
								<p>
									You already use SaaS tools, but workarounds, duplicate data
									and rigid workflows are slowing the team down.
								</p>
								<span className="path-link">
									Review your current stack <ArrowRight size={16} />
								</span>
							</Link>
						</div>
						<p className="path-note">
							Both paths lead to the same first step: a System Fit Diagnostic.
						</p>
					</div>
				</section>

				<section
					className="section section--tight"
					aria-labelledby="friction-title"
				>
					<div className="container">
						<Reveal>
							<div className="section-heading section-heading--split">
								<div>
									<p className="eyebrow">Does this sound familiar?</p>
									<h2 id="friction-title" className="display-lg">
										Your business has outgrown the way{" "}
										<span className="highlight">work moves.</span>
									</h2>
								</div>
								<p className="body-lg">
									You do not need another generic app. You need to fix the
									workflow underneath it.
								</p>
							</div>
						</Reveal>
						<div className="pain-grid">
							{PAINS.map(({ Icon, title, copy }) => (
								<article className="pain-card" key={title}>
									<Icon size={23} />
									<h3>{title}</h3>
									<p>{copy}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section id="method" className="section" aria-labelledby="method-title">
					<div className="container decision-grid">
						<Reveal>
							<div className="decision-statement">
								<p className="eyebrow">Build less. Improve more.</p>
								<h2 id="method-title" className="display-lg">
									We do not default to{" "}
									<span className="highlight">custom software.</span>
								</h2>
								<p>
									Before writing a line of code, we assess the workflow, data,
									people and systems involved. Then we recommend the
									least-complex route to the business outcome.
								</p>
							</div>
						</Reveal>
						<div>
							<div className="decision-list">
								{DECISIONS.map(({ Icon, title, copy }) => (
									<div className="decision-row" key={title}>
										<span className="decision-icon">
											<Icon size={21} />
										</span>
										<div>
											<h3>{title}</h3>
											<p>{copy}</p>
										</div>
									</div>
								))}
							</div>
							<p className="body-sm decision-note">
								The recommendation is useful even if it means Resetrix should
								not build the solution.
							</p>
						</div>
					</div>
				</section>

				<section
					id="offers"
					className="section surface-band"
					aria-labelledby="offers-title"
				>
					<div className="container">
						<Reveal>
							<div className="section-heading">
								<p className="eyebrow">Choose the next right step.</p>
								<h2 id="offers-title" className="display-lg">
									Start small. Prove value. Scale with{" "}
									<span className="highlight">confidence.</span>
								</h2>
								<p className="body-lg">
									You do not need to commit to a large transformation programme
									on day one. Start with the amount of change your business can
									absorb.
								</p>
							</div>
						</Reveal>
						<div className="offers">
							{OFFERS.map((offer) => (
								<article
									className={`offer ${offer.featured ? "offer--featured" : ""}`}
									key={offer.title}
								>
									{offer.featured ? (
										<span className="offer-badge">
											Most common starting point
										</span>
									) : null}
									<p className="offer-kicker">{offer.kicker}</p>
									<h3>{offer.title}</h3>
									<p>{offer.copy}</p>
									<div className="offer-meta">
										<div>
											<span>Timeline</span>
											<b>{offer.timeline}</b>
										</div>
										<div>
											<span>Focus</span>
											<b>{offer.focus}</b>
										</div>
										<div>
											<span>Investment</span>
											<b>{offer.investment}</b>
										</div>
									</div>
									<ul>
										{offer.items.map((item) => (
											<li key={item}>
												<Check size={16} />
												<span>{item}</span>
											</li>
										))}
									</ul>
									<a
										className={`btn ${offer.featured ? "btn--accent" : "btn--primary"}`}
										href="#contact"
									>
										{offer.cta} <ArrowRight size={16} />
									</a>
									<p className="offer-fit">{offer.note}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="section" aria-labelledby="process-title">
					<div className="container">
						<div className="process-wrap">
							<p className="eyebrow">A low-risk way to change</p>
							<h2 id="process-title" className="display-lg">
								The system is only the beginning. The work has to{" "}
								<span className="highlight">change.</span>
							</h2>
							<p className="body-lg">
								Every Resetrix engagement moves from operational clarity into a
								measured, adopted change, not a feature handover.
							</p>
							<div className="steps">
								{[
									[
										"Map the drag",
										"Identify the people, hand-offs and exceptions causing the cost.",
									],
									[
										"Set the signal",
										"Agree one owner and one meaningful measure of success.",
									],
									[
										"Ship the change",
										"Build or connect the least-complex solution that can move the metric.",
									],
									[
										"Keep it moving",
										"Review adoption, exceptions and value after launch, then decide the next improvement.",
									],
								].map(([title, copy], index) => (
									<div className="step" key={title}>
										<span className="step-no">0{index + 1}</span>
										<h3>{title}</h3>
										<p>{copy}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="section section--tight">
					<div className="container">
						<div className="proof-band">
							<div className="proof-copy">
								<p className="eyebrow">When the workflow is proven</p>
								<h2 className="display-lg">
									Connect operations without replacing{" "}
									<span className="highlight">everything</span> at once.
								</h2>
								<p>
									We use integrations, practical data models and focused custom
									software to remove friction between the systems your team
									depends on.
								</p>
								<div className="proof-points">
									<div>
										<Check size={18} />
										<span>
											One partner from workflow design through to secure
											deployment.
										</span>
									</div>
									<div>
										<Check size={18} />
										<span>
											Custom software only where a standard tool cannot carry
											the operation.
										</span>
									</div>
									<div>
										<Check size={18} />
										<span>
											Every role gets the right action and management gets a
											reliable view.
										</span>
									</div>
								</div>
							</div>
							<div className="proof-image">
								<OperationalIllustration
									variant="connected"
									label="Connected operational systems"
								/>
								<div className="image-evidence">
									<p>System map / connected</p>
									<span>
										<CircleDot size={13} /> Data → outcome
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="care" className="section">
					<div className="container care-grid">
						<div className="care-image">
							<OperationalIllustration
								variant="care"
								label="Operational performance review"
							/>
						</div>
						<div>
							<p className="eyebrow">Launch is not the finish line.</p>
							<h2 className="display-lg">
								Keep the workflow secure,{" "}
								<span className="highlight">adopted</span> and improving.
							</h2>
							<p className="body-lg section-copy">
								Software does not transform an SME on its own. Your team needs
								ownership, practical support and a regular view of whether the
								new way of working is holding up.
							</p>
							<div className="review-list">
								<div>
									<span>Before</span>
									<p>
										Baseline KPI, process owner, access model and role-based
										training are agreed.
									</p>
								</div>
								<div>
									<span>30 days</span>
									<p>
										Usage, exceptions and operational performance are reviewed
										against the baseline.
									</p>
								</div>
								<div>
									<span>90 days</span>
									<p>
										Business outcome, security needs and the next decision
										return to leadership.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="section section--tight surface-band">
					<div className="container decision-grid">
						<div>
							<p className="eyebrow">Focus beats feature lists.</p>
							<h2 className="display-lg">
								One bottleneck. One sprint. One{" "}
								<span className="highlight">outcome</span> to review.
							</h2>
							<p className="body-lg section-copy">
								A Workflow Sprint targets a real operational constraint, then
								proves whether the change is working at 30, 60 and 90 days.
							</p>
							<a className="btn btn--primary section-cta" href="#contact">
								See if your workflow fits a Sprint <ArrowRight size={16} />
							</a>
						</div>
						<div className="care-image">
							<OperationalIllustration
								variant="sprint"
								label="Focused workflow sprint"
							/>
						</div>
					</div>
				</section>

				<section id="faq" className="section" aria-labelledby="faq-title">
					<div className="container">
						<div className="section-heading section-heading--center">
							<p className="eyebrow">Clarity before commitment.</p>
							<h2 id="faq-title" className="display-lg">
								The questions worth{" "}
								<span className="highlight">asking first.</span>
							</h2>
						</div>
						<div className="faq">
							{FAQS.map(([question, answer]) => (
								<details key={question}>
									<summary>
										{question}
										<Plus size={20} />
									</summary>
									<p>{answer}</p>
								</details>
							))}
						</div>
					</div>
				</section>

				<section
					id="contact"
					className="contact-band"
					aria-labelledby="contact-title"
				>
					<div className="container contact-grid">
						<div>
							<p className="eyebrow">
								Start with the work that is getting stuck.
							</p>
							<h2 id="contact-title" className="display-lg">
								Find the bottleneck worth{" "}
								<span className="highlight">fixing first.</span>
							</h2>
							<p className="body-lg section-copy">
								Bring us the workflow slowing down your business. We will tell
								you whether an Operational Clarity Diagnostic is the right next
								step.
							</p>
							<div className="contact-facts">
								<div>
									<CircleDot size={18} />
									<span>No generic pitch. No pressure to build.</span>
								</div>
								<div>
									<TimerReset size={18} />
									<span>
										We respond to qualified enquiries within one business day.
									</span>
								</div>
							</div>
						</div>
						<form className="contact-form" onSubmit={submitContact}>
							<div className="field">
								<label htmlFor="name">Name</label>
								<input
									id="name"
									name="name"
									required
									autoComplete="name"
									placeholder="Your name"
								/>
							</div>
							<div className="field">
								<label htmlFor="email">Work email</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									placeholder="name@company.com"
								/>
							</div>
							<div className="field">
								<label htmlFor="company">Company</label>
								<input
									id="company"
									name="company"
									required
									autoComplete="organization"
									placeholder="Company name"
								/>
							</div>
							<div className="field">
								<label htmlFor="role">Your role</label>
								<select id="role" name="role" required defaultValue="">
									<option value="" disabled>
										Select your role
									</option>
									<option>Owner / Director</option>
									<option>COO / General Manager</option>
									<option>Operations</option>
									<option>Technology</option>
									<option>Other</option>
								</select>
							</div>
							<div className="field">
								<label htmlFor="team-size">Team size</label>
								<select
									id="team-size"
									name="team-size"
									required
									defaultValue=""
								>
									<option value="" disabled>
										Select team size
									</option>
									<option>1-10</option>
									<option>11-50</option>
									<option>51-200</option>
									<option>200+</option>
								</select>
							</div>
							<div className="field">
								<label htmlFor="timeframe">Target timeframe</label>
								<select
									id="timeframe"
									name="timeframe"
									required
									defaultValue=""
								>
									<option value="" disabled>
										Select timeframe
									</option>
									<option>Within 3 months</option>
									<option>3-6 months</option>
									<option>6-12 months</option>
									<option>Exploring</option>
								</select>
							</div>
							{[
								[
									"workflow",
									"Which workflow is causing the most friction?",
									"For example: quotation-to-order, service scheduling, fulfilment or reporting.",
								],
								[
									"impact",
									"What is the impact today?",
									"For example: delays, errors, extra headcount or poor visibility.",
								],
								[
									"systems",
									"Which systems are involved?",
									"List the software, spreadsheets and communication tools involved.",
								],
								[
									"outcome",
									"What would a useful outcome look like?",
									"Describe the result or measure you want to improve.",
								],
							].map(([name, label, placeholder]) => (
								<div className="field field--full" key={name}>
									<label htmlFor={name}>{label}</label>
									<textarea
										id={name}
										name={name}
										required
										placeholder={placeholder}
									/>
								</div>
							))}
							<p className="form-note">
								Your details will be sent securely to hello@resetrix.com.
							</p>
							<p
								className={`form-status form-status--${contactStatus}`}
								role="status"
								aria-live="polite"
							>
								{contactStatus === "success"
									? "Thanks. Your enquiry has been sent, and we will be in touch within one business day."
									: contactStatus === "error"
										? "We could not send your enquiry. Please try again or email hello@resetrix.com."
										: ""}
							</p>
							<button
								className="btn btn--primary field--full"
								type="submit"
								disabled={contactStatus === "submitting"}
							>
								{contactStatus === "submitting"
									? "Sending..."
									: "Request a fit call"} {" "}
								<ArrowRight size={16} />
							</button>
						</form>
					</div>
				</section>
			</main>

			<footer className="footer">
				<div className="container">
					<div className="footer-grid">
						<div>
							<Brand href="#top" />
							<p className="footer-intro">
								Connected operations for SMEs ready to scale without more
								operational drag.
							</p>
						</div>
						<div>
							<h4>Method</h4>
							<a href="#method">How we decide</a>
							<a href="#offers">Offer stack</a>
							<a href="#care">Transformation Care</a>
						</div>
						<div>
							<h4>Capabilities</h4>
							<Link href="/operational-transformation">
								Transform operations
							</Link>
							<Link href="/software-customisation">Customise software</Link>
							<a href="#contact">Operational Diagnostic</a>
						</div>
						<div>
							<h4>Contact</h4>
							<a href="mailto:hello@resetrix.com">hello@resetrix.com</a>
							<a href="#contact">Request a fit call</a>
							<p>Singapore</p>
						</div>
					</div>
					<div className="footer-bottom">
						<span>© {new Date().getFullYear()} Resetrix Pte. Ltd.</span>
						<span>Digital transformation, engineered for SMEs.</span>
					</div>
				</div>
			</footer>
		</div>
	);
}

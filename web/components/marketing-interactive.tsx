"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import {
	useEffect,
	useRef,
	useState,
	type FormEvent,
	type ReactNode,
} from "react";
import { Brand } from "@/components/brand";
import { ContactVerification } from "@/components/contact-verification";
import { ThemeSwitcher } from "@/components/marketing-shared";

export function Reveal({
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

export function MarketingNav(): React.ReactElement {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

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

	useEffect(() => {
		const desktopQuery = window.matchMedia("(min-width: 1024px)");
		const closeAtDesktop = (event: MediaQueryListEvent): void => {
			if (event.matches) {
				setMenuOpen(false);
			}
		};
		desktopQuery.addEventListener("change", closeAtDesktop);
		return (): void => {
			desktopQuery.removeEventListener("change", closeAtDesktop);
		};
	}, []);

	const closeMenu = (): void => {
		setMenuOpen(false);
	};

	return (
		<>
			<header className={`nav-shell ${scrolled ? "is-scrolled" : ""}`}>
				<nav className="container nav" aria-label="Primary navigation">
					<Brand href="#top" />
					<div className="nav-links">
						<Link href="/workflow-digitalisation">Digitalise operations</Link>
						<Link href="/software-customisation">Customise software</Link>
						<a href="#method">Method</a>
						<a href="#faq">FAQ</a>
					</div>
					<div className="nav-actions">
						<ThemeSwitcher />
						<a className="btn btn--accent" href="#contact">
							Book a fit call <ArrowRight size={16} />
						</a>
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
				inert={!menuOpen}
			>
				<Link href="/workflow-digitalisation" onClick={closeMenu}>
					Digitalise operations
				</Link>
				<Link href="/software-customisation" onClick={closeMenu}>
					Customise software
				</Link>
				<a href="#method" onClick={closeMenu}>
					Method
				</a>
				<a href="#offers" onClick={closeMenu}>
					Offers
				</a>
				<a href="#faq" onClick={closeMenu}>
					FAQ
				</a>
				<ThemeSwitcher />
				<a className="btn btn--accent" href="#contact" onClick={closeMenu}>
					Book a fit call <ArrowRight size={16} />
				</a>
			</div>
		</>
	);
}

const CONTACT_TEXTAREAS = [
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
] as const;

export function ContactForm(): React.ReactElement {
	const [token, setToken] = useState("");
	const [verificationAttempt, setVerificationAttempt] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const submitting = useRef(false);
	const [status, setStatus] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");

	const submitContact = async (
		event: FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault();
		if (submitting.current) return;
		if (!token) {
			setErrorMessage(
				"Please complete the verification before sending your enquiry."
			);
			setStatus("error");
			return;
		}
		submitting.current = true;
		const formElement = event.currentTarget;
		setStatus("submitting");

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...Object.fromEntries(new FormData(formElement)),
					"cf-turnstile-response": token,
				}),
			});
			if (!response.ok) {
				const messages: Record<number, string> = {
					403: "Verification failed or expired. Please verify again and retry.",
					413: "Your enquiry is too long. Please shorten it and try again.",
					429: "Too many attempts. Please wait 10 minutes before trying again.",
					503: "Verification is temporarily unavailable. Please try again later or email hello@resetrix.com.",
				};
				setErrorMessage(
					messages[response.status] ??
						"We could not send your enquiry. Please try again or email hello@resetrix.com."
				);
				setStatus("error");
				return;
			}
			formElement.reset();
			setStatus("success");
		} catch {
			setErrorMessage(
				"We could not send your enquiry. Please try again or email hello@resetrix.com."
			);
			setStatus("error");
		} finally {
			// This handler owns the lock; concurrent submissions return before the try.
			// eslint-disable-next-line require-atomic-updates
			submitting.current = false;
			setToken("");
			setVerificationAttempt((attempt) => attempt + 1);
		}
	};

	return (
		<form className="contact-form" onSubmit={submitContact}>
			<div hidden aria-hidden="true">
				<label htmlFor="contact-website">Leave this field empty</label>
				<input
					id="contact-website"
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>
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
				<select id="team-size" name="team-size" required defaultValue="">
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
				<select id="timeframe" name="timeframe" required defaultValue="">
					<option value="" disabled>
						Select timeframe
					</option>
					<option>Within 3 months</option>
					<option>3-6 months</option>
					<option>6-12 months</option>
					<option>Exploring</option>
				</select>
			</div>
			{CONTACT_TEXTAREAS.map(([name, label, placeholder]) => (
				<div className="field field--full" key={name}>
					<label htmlFor={name}>{label}</label>
					<textarea id={name} name={name} required placeholder={placeholder} />
				</div>
			))}
			<ContactVerification key={verificationAttempt} onToken={setToken} />
			{!token && (
				<button
					type="button"
					className="btn field--full"
					disabled={status === "submitting"}
					onClick={() => {
						setToken("");
						setVerificationAttempt((attempt) => attempt + 1);
					}}
				>
					Retry verification
				</button>
			)}
			<p className="form-note">
				Your details will be sent securely to hello@resetrix.com.
			</p>
			<p
				className={`form-status form-status--${status}`}
				role="status"
				aria-live="polite"
			>
				{status === "success"
					? "Thanks. Your enquiry has been sent, and we will be in touch within one business day."
					: status === "error"
						? errorMessage
						: ""}
			</p>
			<button
				className="btn btn--primary field--full"
				type="submit"
				disabled={status === "submitting"}
			>
				{status === "submitting" ? "Sending..." : "Request a fit call"}{" "}
				<ArrowRight size={16} />
			</button>
		</form>
	);
}

"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface Turnstile {
	render: (
		container: HTMLElement,
		options: {
			sitekey: string;
			action: string;
			callback: (token: string) => void;
			"expired-callback": () => void;
			"error-callback": () => void;
			"timeout-callback": () => void;
		}
	) => string;
	remove: (widget: string) => void;
}

declare global {
	interface Window {
		turnstile?: Turnstile;
	}
}

export function ContactVerification({
	onToken,
}: {
	readonly onToken: (token: string) => void;
}): React.ReactElement {
	const container = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);
	const [failed, setFailed] = useState(false);
	const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

	useEffect(() => {
		const turnstile = window.turnstile;
		if (!ready || !sitekey || !container.current || !turnstile) return;
		const invalidate = (): void => {
			onToken("");
			setFailed(true);
		};
		const widget = turnstile.render(container.current, {
			sitekey,
			action: "contact",
			callback: (token): void => {
				onToken(token);
				setFailed(false);
			},
			"expired-callback": invalidate,
			"error-callback": invalidate,
			"timeout-callback": invalidate,
		});
		return (): void => {
			turnstile.remove(widget);
		};
	}, [ready, sitekey, onToken]);

	return (
		<div className="field--full">
			{sitekey && (
				<Script
					src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
					onReady={() => {
						setReady(true);
					}}
					onError={() => {
						onToken("");
						setFailed(true);
					}}
				/>
			)}
			<div ref={container} />
			{(!sitekey || failed) && (
				<p role="status">
					Verification is unavailable or has expired. Retry verification, or
					email hello@resetrix.com.
				</p>
			)}
		</div>
	);
}

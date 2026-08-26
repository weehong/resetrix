"use client";

import { useSyncExternalStore } from "react";

type Appearance = "light" | "dark" | "system";

const OPTIONS: ReadonlyArray<{ value: Appearance; label: string }> = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "system", label: "System" },
];

const APPEARANCE_EVENT = "resetrix:appearance";

function getAppearance(): Appearance {
	const appearance = document.documentElement.dataset["appearance"];
	return appearance === "light" ||
		appearance === "dark" ||
		appearance === "system"
		? appearance
		: "system";
}

function getServerAppearance(): Appearance {
	return "system";
}

function resolveAppearance(appearance: Appearance): void {
	const dark =
		appearance === "dark" ||
		(appearance === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", dark);
	document.documentElement.dataset["appearance"] = appearance;
}

/** Compact radio group for the persisted light, dark or system appearance. */
export function AppearanceSelector(): React.ReactElement {
	const appearance = useSyncExternalStore(
		(notify) => {
			const media = window.matchMedia("(prefers-color-scheme: dark)");
			const handleSystemChange = (): void => {
				if (document.documentElement.dataset["appearance"] === "system") {
					resolveAppearance("system");
				}
				notify();
			};
			media.addEventListener("change", handleSystemChange);
			window.addEventListener(APPEARANCE_EVENT, notify);
			return (): void => {
				media.removeEventListener("change", handleSystemChange);
				window.removeEventListener(APPEARANCE_EVENT, notify);
			};
		},
		getAppearance,
		getServerAppearance
	);

	const select = (next: Appearance): void => {
		resolveAppearance(next);
		try {
			localStorage.setItem("appearance", next);
		} catch {
			// Appearance still applies for this page when storage is unavailable.
		}
		window.dispatchEvent(new Event(APPEARANCE_EVENT));
	};

	return (
		<div
			role="radiogroup"
			aria-label="Appearance"
			className="flex h-10 items-center rounded-full border border-control bg-surface-raised p-1 shadow-(--shadow-xs)"
		>
			{OPTIONS.map(
				(option): React.ReactElement => (
					<button
						key={option.value}
						type="button"
						role="radio"
						aria-checked={appearance === option.value}
						onClick={() => {
							select(option.value);
						}}
						className="h-8 rounded-full px-2.5 text-[0.6875rem] font-semibold text-ink-muted transition-colors aria-checked:bg-cta aria-checked:text-cta-label sm:px-3 sm:text-xs"
					>
						{option.label}
					</button>
				)
			)}
		</div>
	);
}

"use client";

import { CloudSun, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Appearance = "light" | "system" | "dark";

const APPEARANCE_EVENT = "resetrix-appearance-change";

const APPEARANCES = [
	{ value: "light", label: "Use light appearance", Icon: Sun },
	{ value: "system", label: "Use system appearance", Icon: CloudSun },
	{ value: "dark", label: "Use dark appearance", Icon: Moon },
] as const;

function applyAppearance(appearance: Appearance): void {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const isDark =
		appearance === "dark" || (appearance === "system" && prefersDark);
	document.documentElement.classList.toggle("dark", isDark);
	document.documentElement.dataset["appearance"] = appearance;
	localStorage.setItem("appearance", appearance);
	window.dispatchEvent(new Event(APPEARANCE_EVENT));
}

function getStoredAppearance(): Appearance {
	const stored = localStorage.getItem("appearance");
	return stored === "light" || stored === "dark" || stored === "system"
		? stored
		: "system";
}

function subscribeToAppearance(onStoreChange: () => void): () => void {
	window.addEventListener("storage", onStoreChange);
	window.addEventListener(APPEARANCE_EVENT, onStoreChange);
	return () => {
		window.removeEventListener("storage", onStoreChange);
		window.removeEventListener(APPEARANCE_EVENT, onStoreChange);
	};
}

export function ThemeSwitcher(): React.ReactElement {
	const appearance = useSyncExternalStore(
		subscribeToAppearance,
		getStoredAppearance,
		() => "system"
	);

	const selectAppearance = (nextAppearance: Appearance): void => {
		applyAppearance(nextAppearance);
	};

	return (
		<div
			className="theme-switcher"
			aria-label="Choose colour mode"
			role="group"
		>
			{APPEARANCES.map(({ value, label, Icon }) => (
				<button
					type="button"
					key={value}
					className={appearance === value ? "active" : ""}
					onClick={() => {
						selectAppearance(value);
					}}
					aria-label={label}
					aria-pressed={appearance === value}
				>
					<Icon size={15} strokeWidth={1.75} />
				</button>
			))}
		</div>
	);
}

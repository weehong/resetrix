"use client";

import Link from "next/link";
import { CloudSun, Moon, Sun } from "lucide-react";
import { useState } from "react";

type Appearance = "light" | "system" | "dark";

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
}

export function ThemeSwitcher(): React.ReactElement {
	const [appearance, setAppearance] = useState<Appearance>("system");

	const selectAppearance = (nextAppearance: Appearance): void => {
		setAppearance(nextAppearance);
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

export function Brand({
	href = "/",
}: {
	readonly href?: string;
}): React.ReactElement {
	return (
		<Link className="brand" href={href} aria-label="Resetrix home">
			<span className="brand-mark" aria-hidden="true">
				R
			</span>
			<span className="brand-wordmark">
				<span>Resetrix</span>
				<small>Operations, reset</small>
			</span>
		</Link>
	);
}

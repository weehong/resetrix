export type AppearancePreference = "light" | "dark" | "system";

export type ResolvedAppearance = "light" | "dark";

export const APPEARANCE_STORAGE_KEY = "resetrix.appearance";

export function readAppearancePreference(): AppearancePreference {
	try {
		const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
		if (stored === "light" || stored === "dark" || stored === "system") {
			return stored;
		}
	} catch {
		// localStorage unavailable (private mode, SSR, etc.)
	}
	return "system";
}

export function writeAppearancePreference(preference: AppearancePreference): void {
	try {
		window.localStorage.setItem(APPEARANCE_STORAGE_KEY, preference);
	} catch {
		// localStorage unavailable
	}
}

export function resolveAppearance(preference: AppearancePreference): ResolvedAppearance {
	if (preference === "system") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	return preference;
}

export function applyAppearanceToDocument(preference: AppearancePreference): void {
	const resolved = resolveAppearance(preference);
	const root = document.documentElement;
	root.classList.toggle("dark", resolved === "dark");
	root.dataset["appearance"] = preference;
}

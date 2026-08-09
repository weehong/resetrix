import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
	applyAppearanceToDocument,
	readAppearancePreference,
	resolveAppearance,
	writeAppearancePreference,
	type AppearancePreference,
	type ResolvedAppearance,
} from "./appearance";

const appearanceListeners = new Set<() => void>();

function subscribeAppearance(listener: () => void): () => void {
	appearanceListeners.add(listener);
	return () => {
		appearanceListeners.delete(listener);
	};
}

function notifyAppearanceChanged(): void {
	for (const listener of appearanceListeners) {
		listener();
	}
}

function subscribeSystemScheme(listener: () => void): () => void {
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	media.addEventListener("change", listener);
	return () => {
		media.removeEventListener("change", listener);
	};
}

export function useAppearance(): {
	preference: AppearancePreference;
	resolved: ResolvedAppearance;
	setPreference: (preference: AppearancePreference) => void;
} {
	const preference = useSyncExternalStore(
		(callback) => subscribeAppearance(callback),
		readAppearancePreference,
	);
	const systemIsDark = useSyncExternalStore(
		subscribeSystemScheme,
		() => window.matchMedia("(prefers-color-scheme: dark)").matches,
	);

	useEffect(() => {
		applyAppearanceToDocument(preference);
	}, [preference, systemIsDark]);

	const setPreference = useCallback((next: AppearancePreference) => {
		writeAppearancePreference(next);
		applyAppearanceToDocument(next);
		notifyAppearanceChanged();
	}, []);

	return {
		preference,
		resolved: resolveAppearance(preference),
		setPreference,
	};
}

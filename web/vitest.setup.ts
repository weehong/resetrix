import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Registers @testing-library/jest-dom matchers with Vitest's `expect`.
import "@testing-library/jest-dom/vitest";

const storage = new Map<string, string>();
const localStorageStub = {
	getItem: (key: string): string | null => storage.get(key) ?? null,
	setItem: (key: string, value: string): void => {
		storage.set(key, value);
	},
	removeItem: (key: string): void => {
		storage.delete(key);
	},
	clear: (): void => storage.clear(),
	key: (index: number): string | null => [...storage.keys()][index] ?? null,
	get length(): number {
		return storage.size;
	},
};

Object.defineProperty(globalThis, "localStorage", {
	configurable: true,
	value: localStorageStub,
});

const matchMedia = vi.fn().mockImplementation((query: string) => ({
	matches: false,
	media: query,
	onchange: null,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	addListener: vi.fn(),
	removeListener: vi.fn(),
	dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: matchMedia,
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
	localStorage.clear();
	document.documentElement.classList.remove("dark");
	delete document.documentElement.dataset["appearance"];
	vi.clearAllMocks();
	matchMedia.mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}));
});

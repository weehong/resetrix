export type Locale = "en" | "zh-CN";

export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "zh-CN"];
export const LOCALE_STORAGE_KEY = "card.locale";

export function resolveLocale(
  stored: string | null | undefined,
  browserLanguages: readonly string[],
): Locale {
  if (stored === "en" || stored === "zh-CN") return stored;
  for (const lang of browserLanguages) {
    if (lang.toLowerCase().startsWith("zh")) return "zh-CN";
  }
  return "en";
}

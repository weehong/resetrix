import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import zhCN from "./zh-CN.json";
import {
  LOCALE_STORAGE_KEY,
  resolveLocale,
  type Locale,
} from "../lib/locale";

function readStoredLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

const initialLocale: Locale = resolveLocale(
  readStoredLocale(),
  typeof navigator !== "undefined" ? navigator.languages ?? [] : [],
);

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "zh-CN": { translation: zhCN },
  },
  lng: initialLocale,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, lng);
  } catch {
    // storage unavailable (private mode) — language still switches for the session
  }
  document.documentElement.lang = lng;
});

document.documentElement.lang = initialLocale;

export default i18n;

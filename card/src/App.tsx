import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "./components/LanguageToggle";
import { ProfileHeader } from "./components/ProfileHeader";
import { ActionBar } from "./components/ActionBar";
import { usePerson } from "./hooks/usePerson";
import styles from "./App.module.css";

export default function App() {
  const { i18n, t } = useTranslation();
  const { metaTitle } = usePerson();
  const [theme, setTheme] = useState<"system" | "light" | "dark">(() => {
    const stored = localStorage.getItem("resetrix-card-theme");
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "dark";
  });
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );

  useEffect(() => {
    document.title = metaTitle;
  }, [metaTitle, i18n.language]);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, []);

  const cycleTheme = () => {
    const next = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    if (next === "system") localStorage.removeItem("resetrix-card-theme");
    else localStorage.setItem("resetrix-card-theme", next);
  };

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className={styles.page} data-theme={resolvedTheme}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <img
            className={styles.brand}
            src="/brand/resetrix-word.svg"
            alt="Resetrix"
            width="126"
            height="22"
          />
          <div className={styles.controls}>
            <LanguageToggle />
            <button
              type="button"
              className={styles.themeToggle}
              onClick={cycleTheme}
              aria-label={`Theme: ${theme}. Click to change.`}
            >
              <span className={styles.themeDot} aria-hidden="true" />
              {theme === "system" ? "Auto" : theme}
            </button>
          </div>
        </header>
        <main className={styles.card}>
          <ProfileHeader />
          <ActionBar />
        </main>
        <p className={styles.footerMark}>{t("profile.footer")}</p>
      </div>
    </div>
  );
}

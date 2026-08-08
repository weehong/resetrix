import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES, type Locale } from "../lib/locale";
import styles from "../App.module.css";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  return (
    <div className={styles.langToggle} role="group" aria-label={t("language.label")}>
      {SUPPORTED_LOCALES.map((locale: Locale) => (
        <button
          key={locale}
          type="button"
          className={`${styles.langOption} ${
            i18n.language === locale ? styles.langOptionActive : ""
          }`}
          aria-pressed={i18n.language === locale}
          onClick={() => void i18n.changeLanguage(locale)}
        >
          {t(`language.${locale}`)}
        </button>
      ))}
    </div>
  );
}

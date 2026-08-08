import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "./components/LanguageToggle";
import { ProfileHeader } from "./components/ProfileHeader";
import { ActionBar } from "./components/ActionBar";
import { DetailList } from "./components/DetailList";
import { usePerson } from "./hooks/usePerson";
import styles from "./App.module.css";

export default function App() {
  const { i18n } = useTranslation();
  const { metaTitle } = usePerson();

  useEffect(() => {
    document.title = metaTitle;
  }, [metaTitle, i18n.language]);

  return (
    <div className={styles.page}>
      <LanguageToggle />
      <main className={styles.card}>
        <ProfileHeader />
        <ActionBar />
        <DetailList />
      </main>
      <p className={styles.footerMark} aria-hidden="true">
        Resetrix<span className={styles.footerDot}>.</span>
      </p>
    </div>
  );
}

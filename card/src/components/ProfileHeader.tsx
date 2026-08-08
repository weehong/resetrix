import { useTranslation } from "react-i18next";
import { contact } from "../data/contact";
import styles from "../App.module.css";

export function ProfileHeader() {
  const { t } = useTranslation();

  return (
    <header className={styles.identity}>
      <div className={styles.logoWrap}>
        <img
          src="/brand/resetrix-logo.png"
          alt={t(contact.companyKey)}
          className={styles.logo}
          width={88}
          height={88}
        />
      </div>
      <h1 className={styles.name}>{contact.displayName}</h1>
      <p className={styles.role}>{t(contact.titleKey)}</p>
      <p className={styles.company}>{t(contact.companyKey)}</p>
      <div className={styles.divider} aria-hidden="true" />
      <p className={styles.slogan}>{t(contact.sloganKey)}</p>
    </header>
  );
}

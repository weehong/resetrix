import { useTranslation } from "react-i18next";
import { usePerson } from "../hooks/usePerson";
import styles from "../App.module.css";

export function ProfileHeader() {
  const { t } = useTranslation();
  const { displayName, title, company, slogan } = usePerson();

  return (
    <header className={styles.identity}>
      <div className={styles.profileRow}>
        <div className={styles.logoFrame}>
          <img
            src="/brand/resetrix-mark.svg"
            alt={company}
            className={styles.companyLogo}
            width={252}
            height={44}
          />
        </div>
        <div className={styles.profileCopy}>
          <h1 className={styles.name}>{displayName}</h1>
          <p className={styles.role}>
            {title}<span aria-hidden="true"> · </span>{company}
          </p>
          <div className={styles.tags} aria-label={t("profile.tagsLabel")}>
            <span>{t("profile.location")}</span>
            <span>{t("profile.industry")}</span>
          </div>
        </div>
      </div>
      <p className={styles.slogan}>{slogan}</p>
    </header>
  );
}

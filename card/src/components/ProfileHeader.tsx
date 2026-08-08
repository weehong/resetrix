import { usePerson } from "../hooks/usePerson";
import styles from "../App.module.css";

export function ProfileHeader() {
  const { displayName, title, company, slogan } = usePerson();

  return (
    <header className={styles.identity}>
      <div className={styles.logoWrap}>
        <img
          src="/brand/resetrix-logo.png"
          alt={company}
          className={styles.logo}
          width={88}
          height={88}
        />
      </div>
      <h1 className={styles.name}>{displayName}</h1>
      <p className={styles.role}>{title}</p>
      <p className={styles.company}>{company}</p>
      <div className={styles.divider} aria-hidden="true" />
      <p className={styles.slogan}>{slogan}</p>
    </header>
  );
}

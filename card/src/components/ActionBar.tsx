import { useTranslation } from "react-i18next";
import { buildVcard, downloadVcard } from "../lib/vcard";
import { usePerson } from "../hooks/usePerson";
import styles from "../App.module.css";

function IconUserPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      <path d="M9.2 8.5c.2 2.5 1.8 4.1 4.3 4.3" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function ActionBar() {
  const { t } = useTranslation();
  const {
    person,
    title,
    company,
    slogan,
    address,
  } = usePerson();

  const handleSave = () => {
    const vcard = buildVcard(person, { title, company, slogan, address });
    downloadVcard(person.vcardFilename, vcard);
  };

  const whatsappUrl = `https://wa.me/${person.phoneTel.replace(/\D/g, "")}`;

  const secondary = [
    { key: "call", href: `tel:${person.phoneTel}`, icon: <IconPhone />, external: false },
    { key: "email", href: `mailto:${person.email}`, icon: <IconMail />, external: false },
    { key: "whatsapp", href: whatsappUrl, icon: <IconWhatsApp />, external: true },
    { key: "linkedin", href: person.linkedin, icon: <IconLinkedIn />, external: true },
  ] as const;

  return (
    <>
      <button type="button" className={styles.saveButton} onClick={handleSave}>
        <IconUserPlus />
        {t("actions.saveContact")}
      </button>
      <div className={styles.secondaryRow}>
        {secondary.map((action) => (
          <a
            key={action.key}
            className={styles.secondaryAction}
            href={action.href}
            aria-label={t(`actions.${action.key}`)}
            {...(action.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {action.icon}
            <span>{t(`actions.${action.key}`)}</span>
          </a>
        ))}
      </div>
    </>
  );
}

import { useTranslation } from "react-i18next";
import { contact } from "../data/contact";
import { buildVcard, downloadVcard } from "../lib/vcard";
import { buildMapsUrl } from "../lib/maps";
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

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ActionBar() {
  const { t } = useTranslation();

  const handleSave = () => {
    const vcard = buildVcard(contact, {
      title: t(contact.titleKey),
      company: t(contact.companyKey),
      slogan: t(contact.sloganKey),
      address: t(contact.addressKey),
    });
    downloadVcard("Vernon-Wee-Hong-KOH.vcf", vcard);
  };

  const mapsUrl = buildMapsUrl(contact.addressQuery, navigator.userAgent);

  const secondary = [
    { key: "call", href: `tel:${contact.phoneTel}`, icon: <IconPhone />, external: false },
    { key: "email", href: `mailto:${contact.email}`, icon: <IconMail />, external: false },
    { key: "website", href: contact.website, icon: <IconGlobe />, external: true },
    { key: "maps", href: mapsUrl, icon: <IconMapPin />, external: true },
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

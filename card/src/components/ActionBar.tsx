import { useState } from "react";
import { useTranslation } from "react-i18next";
import { buildVcard, downloadVcard } from "../lib/vcard";
import { buildMapsUrl } from "../lib/maps";
import { usePerson } from "../hooks/usePerson";
import styles from "../App.module.css";

export function ActionBar() {
  const { t } = useTranslation();
  const [qrOpen, setQrOpen] = useState(false);
  const [shared, setShared] = useState(false);
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
  const mapsUrl = buildMapsUrl(person.addressQuery, navigator.userAgent);

  const handleShare = async () => {
    const data = { title: person.displayName, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      // Dismissing the native share sheet needs no error state.
    }
  };

  const actions = [
    { key: "call", value: person.phoneDisplay, href: `tel:${person.phoneTel}`, external: false },
    { key: "whatsapp", value: t("actions.messageMe"), href: whatsappUrl, external: true },
    { key: "email", value: person.email, href: `mailto:${person.email}`, external: false },
    { key: "website", value: person.website.replace(/^https:\/\//, ""), href: person.website, external: true },
    { key: "linkedin", value: t("actions.connect"), href: person.linkedin, external: true },
    { key: "directions", value: t("actions.officeAddress"), href: mapsUrl, external: true },
  ] as const;

  return (
    <>
      <button type="button" className={styles.saveButton} onClick={handleSave}>
        {t("actions.saveContact")}
        <span>VCF</span>
      </button>
      <div className={styles.actionGrid}>
        {actions.map((action) => (
          <a
            key={action.key}
            className={styles.actionTile}
            href={action.href}
            aria-label={t(`actions.${action.key}`)}
            {...(action.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className={styles.actionCopy}>
              <span className={styles.actionLabel}>{t(`actions.${action.key}`)}</span>
              <span className={styles.actionValue}>{action.value}</span>
            </span>
            <span className={styles.actionArrow} aria-hidden="true">→</span>
          </a>
        ))}
      </div>
      <div className={styles.utilityRow}>
        <button type="button" onClick={() => void handleShare()}>
          {shared ? t("actions.linkCopied") : t("actions.shareCard")}
        </button>
        <button type="button" onClick={() => setQrOpen((open) => !open)} aria-expanded={qrOpen}>
          {qrOpen ? t("actions.hideQr") : t("actions.showQr")}
        </button>
      </div>
      {qrOpen ? (
        <div className={styles.qrPanel}>
          <img src="/qr/resetrix-biz-vernonkoh.svg" alt={t("actions.qrAlt")} width="180" height="180" />
          <p>{t("actions.qrHelp")}</p>
        </div>
      ) : null}
    </>
  );
}

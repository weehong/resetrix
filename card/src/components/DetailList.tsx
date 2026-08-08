import { useTranslation } from "react-i18next";
import { buildMapsUrl } from "../lib/maps";
import { usePerson } from "../hooks/usePerson";
import styles from "../App.module.css";

export function DetailList() {
  const { t } = useTranslation();
  const {
    phoneDisplay,
    phoneTel,
    email,
    website,
    address,
    addressQuery,
  } = usePerson();
  const mapsUrl = buildMapsUrl(addressQuery, navigator.userAgent);

  const rows = [
    {
      label: t("labels.phone"),
      value: phoneDisplay,
      href: `tel:${phoneTel}`,
    },
    {
      label: t("labels.email"),
      value: email,
      href: `mailto:${email}`,
    },
    {
      label: t("labels.website"),
      value: website.replace(/^https:\/\//, ""),
      href: website,
    },
    {
      label: t("labels.address"),
      value: address,
      href: mapsUrl,
    },
  ];

  return (
    <dl className={styles.details}>
      {rows.map((row) => (
        <div key={row.label} className={styles.detailRow}>
          <dt className={styles.detailLabel}>{row.label}</dt>
          <dd className={styles.detailValueWrap}>
            <a className={styles.detailValue} href={row.href}>
              {row.value}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}

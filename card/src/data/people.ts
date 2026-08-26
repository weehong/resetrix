import type { Locale } from "../lib/locale";

export interface PersonCopy {
  metaTitle: string;
  title: string;
  company: string;
  slogan: string;
  address: string;
}

export interface Person {
  shortName: string;
  displayName: string;
  name: { family: string; given: string; additional: string };
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  website: string;
  linkedin: string;
  addressQuery: string;
  vcardFilename: string;
  copy: Record<Locale, PersonCopy>;
}

export const people: Record<string, Person> = {
  vernonkoh: {
    shortName: "vernonkoh",
    displayName: "Vernon Wee Hong KOH",
    name: {
      family: "KOH",
      given: "Vernon",
      additional: "Wee Hong",
    },
    phoneDisplay: "(+65) 8714 8614",
    phoneTel: "+6587148614",
    email: "vernonkoh@resetrix.com",
    website: "https://resetrix.com",
    linkedin: "https://www.linkedin.com/in/vernonweehong/",
    addressQuery:
      "60 Paya Lebar Road #06-28 Paya Lebar Square Singapore 409051",
    vcardFilename: "Vernon-Wee-Hong-KOH.vcf",
    copy: {
      en: {
        metaTitle: "Vernon Wee Hong KOH — RESETRIX PTE. LTD.",
        title: "Founder",
        company: "RESETRIX PTE. LTD.",
        slogan: "Re-think, Re-work, Re-focus",
        address:
          "60 Paya Lebar Road, #06-28 Paya Lebar Square, Singapore 409051",
      },
      "zh-CN": {
        metaTitle: "Vernon Wee Hong KOH — 润思创科 RESETRIX PTE. LTD.",
        title: "创始人",
        company: "润思创科 RESETRIX PTE. LTD.",
        slogan: "重新思考 · 重塑流程 · 重新聚焦",
        address: "新加坡巴耶利峇路60号 巴耶利峇广场 #06-28，邮编 409051",
      },
    },
  },
};

export const DEFAULT_PERSON: Person = people.vernonkoh;

export type Contact = Person;

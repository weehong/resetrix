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
    email: "hello@resetrix.sg",
    website: "https://resetrix.com",
    linkedin: "https://www.linkedin.com/in/vernonweehong/",
    addressQuery:
      "60 Paya Lebar Road #06-28 Paya Lebar Square Singapore 409051",
    vcardFilename: "Vernon-Wee-Hong-KOH.vcf",
    copy: {
      en: {
        metaTitle: "Vernon Wee Hong KOH — Resetrix Pte. Ltd.",
        title: "Founder",
        company: "Resetrix Pte. Ltd.",
        slogan:
          "Digital transformation, engineered for SMEs. Technical consultancy and custom software, built around your business.",
        address:
          "60 Paya Lebar Road, #06-28 Paya Lebar Square, Singapore 409051",
      },
      "zh-CN": {
        metaTitle: "Vernon Wee Hong KOH — 润思创科 Resetrix Pte. Ltd.",
        title: "创始人",
        company: "润思创科 Resetrix Pte. Ltd.",
        slogan: "为中小企业量身打造数字化转型。围绕您的业务，提供技术咨询与定制软件。",
        address: "新加坡巴耶利峇路60号 巴耶利峇广场 #06-28，邮编 409051",
      },
    },
  },
};

export const DEFAULT_PERSON: Person = people.vernonkoh;

export type Contact = Person;

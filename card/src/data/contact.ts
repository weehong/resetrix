export const CARD_URL = "https://card.resetrix.com";

export const contact = {
  displayName: "Vernon Wee Hong KOH",
  name: {
    family: "KOH",
    given: "Vernon",
    additional: "Wee Hong",
  },
  titleKey: "contact.title",
  companyKey: "contact.company",
  sloganKey: "contact.slogan",
  addressKey: "contact.address",
  phoneDisplay: "(+65) 8714 8614",
  phoneTel: "+6587148614",
  email: "vernonkoh@resetrix.com",
  website: "https://resetrix.com",
  addressQuery:
    "60 Paya Lebar Road #06-28 Paya Lebar Square Singapore 409051",
} as const;

export type Contact = typeof contact;

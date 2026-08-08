import { describe, expect, it } from "vitest";
import { contact } from "../data/contact";
import { buildVcard } from "../lib/vcard";

const text = {
  title: "Founder",
  company: "RESETRIX PTE. LTD.",
  slogan: "Re-think, Re-work, Re-focus",
  address: "60 Paya Lebar Road, #06-28 Paya Lebar Square, Singapore 409051",
};

describe("buildVcard", () => {
  const vcard = buildVcard(contact, text);

  it("produces a vCard 3.0 document", () => {
    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).toContain("VERSION:3.0");
    expect(vcard.trimEnd().endsWith("END:VCARD")).toBe(true);
    expect(vcard).toContain("\r\n");
  });

  it("includes structured and formatted name", () => {
    expect(vcard).toContain("N:KOH;Vernon;Wee Hong;;");
    expect(vcard).toContain("FN:Vernon Wee Hong KOH");
  });

  it("includes org, title, phone, email, website, address and slogan", () => {
    expect(vcard).toContain("ORG:RESETRIX PTE. LTD.");
    expect(vcard).toContain("TITLE:Founder");
    expect(vcard).toContain("TEL;TYPE=CELL,VOICE:+6587148614");
    expect(vcard).toContain("EMAIL;TYPE=INTERNET,WORK:vernonkoh@resetrix.com");
    expect(vcard).toContain("URL:https://resetrix.com");
    expect(vcard).toContain(
      "ADR;TYPE=WORK:;;60 Paya Lebar Road\\, #06-28 Paya Lebar Square\\, Singapore 409051;;;;",
    );
    expect(vcard).toContain("NOTE:Re-think\\, Re-work\\, Re-focus");
  });

  it("escapes commas and semicolons in localized text", () => {
    const withChars = buildVcard(contact, { ...text, company: "A,B;C" });
    expect(withChars).toContain("ORG:A\\,B\\;C");
  });

  it("reflects the active locale text passed in", () => {
    const zh = buildVcard(contact, { ...text, title: "创始人" });
    expect(zh).toContain("TITLE:创始人");
  });
});

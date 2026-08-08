import type { Contact } from "../data/contact";

function escapeVcard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export interface VcardLocalizedText {
  title: string;
  company: string;
  slogan: string;
  address: string;
}

export function buildVcard(c: Contact, text: VcardLocalizedText): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVcard(c.name.family)};${escapeVcard(c.name.given)};${escapeVcard(c.name.additional)};;`,
    `FN:${escapeVcard(c.displayName)}`,
    `ORG:${escapeVcard(text.company)}`,
    `TITLE:${escapeVcard(text.title)}`,
    `TEL;TYPE=CELL,VOICE:${c.phoneTel}`,
    `EMAIL;TYPE=INTERNET,WORK:${c.email}`,
    `URL:${c.website}`,
    `ADR;TYPE=WORK:;;${escapeVcard(text.address)};;;;`,
    `NOTE:${escapeVcard(text.slogan)}`,
    "END:VCARD",
  ];
  return lines.join("\r\n") + "\r\n";
}

export function downloadVcard(filename: string, vcardText: string): void {
  const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

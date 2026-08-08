import { describe, expect, it } from "vitest";
import { buildMapsUrl, isIos } from "../lib/maps";
import { people } from "../data/people";

const addressQuery = people.vernonkoh.addressQuery;

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const IPAD_UA =
  "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36";
const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

describe("isIos", () => {
  it("detects iPhone and iPad user agents", () => {
    expect(isIos(IPHONE_UA)).toBe(true);
    expect(isIos(IPAD_UA)).toBe(true);
  });

  it("rejects Android and desktop user agents", () => {
    expect(isIos(ANDROID_UA)).toBe(false);
    expect(isIos(DESKTOP_UA)).toBe(false);
  });
});

describe("buildMapsUrl", () => {
  it("returns Apple Maps URL on iOS", () => {
    const url = buildMapsUrl(addressQuery, IPHONE_UA);
    expect(url.startsWith("https://maps.apple.com/?q=")).toBe(true);
    expect(url).toContain(encodeURIComponent(addressQuery));
  });

  it("returns Google Maps URL elsewhere", () => {
    for (const ua of [ANDROID_UA, DESKTOP_UA]) {
      const url = buildMapsUrl(addressQuery, ua);
      expect(url.startsWith("https://www.google.com/maps/search/")).toBe(true);
      expect(url).toContain(`query=${encodeURIComponent(addressQuery)}`);
    }
  });

  it("encodes the address safely", () => {
    const url = buildMapsUrl("60 Paya Lebar Road #06-28", ANDROID_UA);
    expect(url).toContain("60%20Paya%20Lebar%20Road%20%2306-28");
    expect(url).not.toContain("#06-28&");
  });
});

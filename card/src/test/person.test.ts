import { describe, expect, it } from "vitest";
import { resolvePerson, subdomainFromHostname } from "../lib/person";
import { DEFAULT_PERSON } from "../data/people";

describe("subdomainFromHostname", () => {
  it("extracts the first label as the subdomain", () => {
    expect(subdomainFromHostname("vernonkoh.resetrix.biz")).toBe("vernonkoh");
  });

  it("returns the single label for a bare host", () => {
    expect(subdomainFromHostname("localhost")).toBe("localhost");
  });

  it("handles leading www", () => {
    expect(subdomainFromHostname("www.resetrix.biz")).toBe("www");
  });
});

describe("resolvePerson", () => {
  it("resolves a known employee subdomain", () => {
    expect(resolvePerson("vernonkoh.resetrix.biz").shortName).toBe("vernonkoh");
  });

  it("falls back to the default person for unknown subdomains", () => {
    expect(resolvePerson("spam.resetrix.biz")).toBe(DEFAULT_PERSON);
    expect(resolvePerson("localhost")).toBe(DEFAULT_PERSON);
    expect(resolvePerson("resetrix.biz")).toBe(DEFAULT_PERSON);
  });
});

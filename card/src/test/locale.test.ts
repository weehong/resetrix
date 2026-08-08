import { describe, expect, it } from "vitest";
import { resolveLocale } from "../lib/locale";

describe("resolveLocale", () => {
  it("uses the stored choice when valid", () => {
    expect(resolveLocale("zh-CN", ["en-US"])).toBe("zh-CN");
    expect(resolveLocale("en", ["zh-Hans-CN"])).toBe("en");
  });

  it("ignores invalid stored values", () => {
    expect(resolveLocale("fr", ["zh-CN"])).toBe("zh-CN");
    expect(resolveLocale("zh-TW", ["en-US"])).toBe("en");
  });

  it("detects any zh* browser language as zh-CN", () => {
    expect(resolveLocale(null, ["zh-CN", "en-US"])).toBe("zh-CN");
    expect(resolveLocale(null, ["en-US", "zh-Hans-SG"])).toBe("zh-CN");
    expect(resolveLocale(null, ["zh-TW"])).toBe("zh-CN");
  });

  it("falls back to English for non-Chinese browsers", () => {
    expect(resolveLocale(null, ["en-SG"])).toBe("en");
    expect(resolveLocale(null, ["ms-SG", "en-US"])).toBe("en");
    expect(resolveLocale(null, [])).toBe("en");
  });

  it("handles undefined stored value", () => {
    expect(resolveLocale(undefined, ["zh-CN"])).toBe("zh-CN");
    expect(resolveLocale(undefined, [])).toBe("en");
  });
});

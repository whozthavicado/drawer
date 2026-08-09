import { describe, expect, it } from "vitest";
import { isLang, translate } from "./i18n";

describe("isLang", () => {
  it("accepts es and en", () => {
    expect(isLang("es")).toBe(true);
    expect(isLang("en")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isLang("fr")).toBe(false);
    expect(isLang(null)).toBe(false);
  });
});

describe("translate", () => {
  it("returns the string for the requested language", () => {
    expect(translate("es", "sidebar.notes")).toBe("Notas");
    expect(translate("en", "sidebar.notes")).toBe("Notes");
  });

  it("interpolates variables", () => {
    expect(translate("en", "notes.count", { filtered: 2, total: 5 })).toBe(
      "2 of 5 notes",
    );
  });

  it("falls back to the key when missing from both dictionaries", () => {
    expect(translate("en", "does.not.exist")).toBe("does.not.exist");
  });
});

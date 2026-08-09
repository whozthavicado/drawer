import { describe, expect, it } from "vitest";
import { isThemeId, THEMES } from "./theme";

describe("isThemeId", () => {
  it("returns true for every registered theme id", () => {
    for (const theme of THEMES) {
      expect(isThemeId(theme.id)).toBe(true);
    }
  });

  it("returns false for an unknown string", () => {
    expect(isThemeId("not-a-real-theme")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isThemeId(null)).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isThemeId("")).toBe(false);
  });
});

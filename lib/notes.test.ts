import { describe, expect, it } from "vitest";
import { displayTitle, parseTags } from "./notes";

describe("displayTitle", () => {
  it("uses the title when present", () => {
    expect(displayTitle({ title: "Idea de producto", content: "..." })).toBe(
      "Idea de producto",
    );
  });

  it("falls back to the first line of content when title is empty", () => {
    expect(
      displayTitle({ title: "", content: "Primera línea\nSegunda línea" }),
    ).toBe("Primera línea");
  });

  it("truncates a long fallback to 60 characters with an ellipsis", () => {
    const longLine = "a".repeat(80);
    expect(displayTitle({ title: "", content: longLine })).toBe(
      "a".repeat(60) + "…",
    );
  });

  it("returns a placeholder when both title and content are empty", () => {
    expect(displayTitle({ title: "", content: "" })).toBe("(nota vacía)");
  });
});

describe("parseTags", () => {
  it("splits comma-separated tags and trims whitespace", () => {
    expect(parseTags("prompts, snippets , ideas")).toEqual([
      "prompts",
      "snippets",
      "ideas",
    ]);
  });

  it("lowercases tags and de-duplicates", () => {
    expect(parseTags("Prompts, prompts, PROMPTS")).toEqual(["prompts"]);
  });

  it("drops empty entries from trailing/double commas", () => {
    expect(parseTags("prompts,, ,ideas,")).toEqual(["prompts", "ideas"]);
  });

  it("returns an empty array for an empty string", () => {
    expect(parseTags("")).toEqual([]);
  });
});

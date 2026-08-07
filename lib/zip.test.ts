import { describe, expect, it } from "vitest";
import { suggestZipName, stripZipExtension } from "./zip";

describe("suggestZipName", () => {
  it("uses the single file's base name when there's one file", () => {
    expect(suggestZipName([{ name: "report.pdf" }])).toBe("report.zip");
  });

  it("uses a generic name when there are multiple files", () => {
    expect(
      suggestZipName([{ name: "a.pdf" }, { name: "b.pdf" }]),
    ).toBe("archivos.zip");
  });

  it("uses a generic name when there are no files", () => {
    expect(suggestZipName([])).toBe("archivos.zip");
  });
});

describe("stripZipExtension", () => {
  it("removes a trailing .zip, case-insensitively", () => {
    expect(stripZipExtension("fotos.ZIP")).toBe("fotos");
  });

  it("leaves a name without .zip unchanged", () => {
    expect(stripZipExtension("fotos")).toBe("fotos");
  });
});

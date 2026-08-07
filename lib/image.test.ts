import { describe, expect, it } from "vitest";
import { swapExtension, mimeForFormat } from "./image";

describe("swapExtension", () => {
  it("replaces an existing extension", () => {
    expect(swapExtension("photo.png", "jpeg")).toBe("photo.jpeg");
  });

  it("adds an extension when there isn't one", () => {
    expect(swapExtension("photo", "webp")).toBe("photo.webp");
  });
});

describe("mimeForFormat", () => {
  it("maps each supported format to its MIME type", () => {
    expect(mimeForFormat("png")).toBe("image/png");
    expect(mimeForFormat("jpeg")).toBe("image/jpeg");
    expect(mimeForFormat("webp")).toBe("image/webp");
  });
});

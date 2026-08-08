import { describe, expect, it } from "vitest";
import { swapMediaExtension } from "./media";

describe("swapMediaExtension", () => {
  it("replaces the extension", () => {
    expect(swapMediaExtension("clip.mp4", "mp3")).toBe("clip.mp3");
  });

  it("adds an extension when there isn't one", () => {
    expect(swapMediaExtension("clip", "wav")).toBe("clip.wav");
  });
});

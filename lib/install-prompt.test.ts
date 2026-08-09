import { describe, expect, it } from "vitest";
import { detectPlatform, isStandaloneDisplay } from "./install-prompt";

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";
const IPAD_UA =
  "Mozilla/5.0 (iPad; CPU OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";
const ANDROID_CHROME_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";
const MAC_SAFARI_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15";
const MAC_CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const WINDOWS_EDGE_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0";

describe("detectPlatform", () => {
  it("detects iPhone as ios", () => {
    expect(detectPlatform(IPHONE_UA)).toBe("ios");
  });

  it("detects iPad as ios", () => {
    expect(detectPlatform(IPAD_UA)).toBe("ios");
  });

  it("detects Android Chrome as android", () => {
    expect(detectPlatform(ANDROID_CHROME_UA)).toBe("android");
  });

  it("detects desktop Safari as desktop-safari", () => {
    expect(detectPlatform(MAC_SAFARI_UA)).toBe("desktop-safari");
  });

  it("does not misdetect desktop Chrome (which also says 'Safari') as desktop-safari", () => {
    expect(detectPlatform(MAC_CHROME_UA)).toBe("other");
  });

  it("does not misdetect Edge as desktop-safari", () => {
    expect(detectPlatform(WINDOWS_EDGE_UA)).toBe("other");
  });
});

describe("isStandaloneDisplay", () => {
  it("is true when the standalone media query matches", () => {
    expect(isStandaloneDisplay(true, undefined)).toBe(true);
  });

  it("is true when the iOS standalone flag is set", () => {
    expect(isStandaloneDisplay(false, true)).toBe(true);
  });

  it("is false when neither signal is present", () => {
    expect(isStandaloneDisplay(false, false)).toBe(false);
    expect(isStandaloneDisplay(false, undefined)).toBe(false);
  });
});

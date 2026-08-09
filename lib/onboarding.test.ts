import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  dismissInstallBanner,
  hasSeenOnboarding,
  isInstallBannerDismissed,
  markOnboardingSeen,
} from "./onboarding";

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  clear() {
    this.store.clear();
  }
}

describe("onboarding + install banner state", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", new MemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hasSeenOnboarding is false until markOnboardingSeen is called", () => {
    expect(hasSeenOnboarding()).toBe(false);
    markOnboardingSeen();
    expect(hasSeenOnboarding()).toBe(true);
  });

  it("isInstallBannerDismissed is false until dismissInstallBanner is called", () => {
    expect(isInstallBannerDismissed()).toBe(false);
    dismissInstallBanner();
    expect(isInstallBannerDismissed()).toBe(true);
  });

  it("the two flags are independent of each other", () => {
    markOnboardingSeen();
    expect(isInstallBannerDismissed()).toBe(false);
  });
});

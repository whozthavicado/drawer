"use client";

import { useEffect, useState } from "react";
import {
  dismissInstallBanner,
  isInstallBannerDismissed,
} from "@/lib/onboarding";
import { detectPlatform, isStandaloneDisplay, type Platform } from "@/lib/install-prompt";
import { useLanguage } from "./language-provider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const standalone = isStandaloneDisplay(
      window.matchMedia?.("(display-mode: standalone)").matches ?? false,
      (window.navigator as unknown as { standalone?: boolean }).standalone,
    );
    if (standalone || isInstallBannerDismissed()) return;

    // Platform/visibility depend on window/navigator, unavailable during
    // SSR — computing them in a lazy initializer would mismatch the
    // server-rendered HTML, so this has to stay a post-mount effect.
    /* eslint-disable react-hooks/set-state-in-effect */
    setPlatform(detectPlatform(navigator.userAgent));
    setVisible(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  function dismiss() {
    dismissInstallBanner();
    setVisible(false);
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      dismissInstallBanner();
      setVisible(false);
    }
    setDeferredPrompt(null);
  }

  if (!visible) return null;

  return (
    <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg border border-border bg-card p-3 sm:mx-6 sm:mt-6">
      <i
        className="ph ph-device-mobile-speaker flex-none"
        style={{ fontSize: 20, color: "var(--accent)" }}
      />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium">{t("installBanner.title")}</p>
        {deferredPrompt ? (
          <p className="text-muted-foreground">{t("installBanner.withPrompt")}</p>
        ) : platform === "ios" ? (
          <p className="text-muted-foreground">
            {t("installBanner.ios").split("{shareIcon}").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 ? (
                  <i className="ph ph-share" style={{ fontSize: 14 }} />
                ) : null}
              </span>
            ))}
          </p>
        ) : platform === "android" ? (
          <p className="text-muted-foreground">{t("installBanner.android")}</p>
        ) : platform === "desktop-safari" ? (
          <p className="text-muted-foreground">{t("installBanner.desktopSafari")}</p>
        ) : (
          <p className="text-muted-foreground">{t("installBanner.other")}</p>
        )}
      </div>
      <div className="flex flex-none items-center gap-2">
        {deferredPrompt ? (
          <button
            type="button"
            onClick={handleInstallClick}
            className="btn btn-primary-filled"
            style={{ minHeight: 36, padding: "0 12px" }}
          >
            {t("installBanner.install")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("installBanner.closeAria")}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-muted-foreground hover:bg-[color-mix(in_srgb,var(--foreground)_7%,transparent)]"
        >
          <i className="ph ph-x" style={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
}

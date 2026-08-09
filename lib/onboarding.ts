const ONBOARDING_KEY = "drawer:onboarding-seen";
const INSTALL_BANNER_DISMISSED_KEY = "drawer:install-banner-dismissed";

export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === "1";
}

export function markOnboardingSeen(): void {
  localStorage.setItem(ONBOARDING_KEY, "1");
}

export function isInstallBannerDismissed(): boolean {
  return localStorage.getItem(INSTALL_BANNER_DISMISSED_KEY) === "1";
}

export function dismissInstallBanner(): void {
  localStorage.setItem(INSTALL_BANNER_DISMISSED_KEY, "1");
}

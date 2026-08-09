export type Platform = "ios" | "android" | "desktop-safari" | "other";

export function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  if (isIOS) return "ios";

  const isAndroid = /android/.test(ua);
  if (isAndroid) return "android";

  const isSafari = /safari/.test(ua) && !/chrome|crios|fxios|edg/.test(ua);
  if (isSafari) return "desktop-safari";

  return "other";
}

export function isStandaloneDisplay(
  matchesStandaloneMediaQuery: boolean,
  iosStandaloneFlag: boolean | undefined,
): boolean {
  return matchesStandaloneMediaQuery || iosStandaloneFlag === true;
}

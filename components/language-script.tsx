import { LANG_STORAGE_KEY } from "@/lib/i18n";

/**
 * Runs synchronously before first paint, same reasoning as ThemeScript:
 * sets the <html lang> attribute from localStorage before React hydrates,
 * so it's correct for screen readers from the very first frame.
 */
export function LanguageScript() {
  const script = `
    try {
      var l = localStorage.getItem(${JSON.stringify(LANG_STORAGE_KEY)});
      if (l === "en") document.documentElement.lang = "en";
    } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

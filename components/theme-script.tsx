import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Runs synchronously before first paint (rendered as a plain <script> tag
 * in <head>, not a React effect) so switching themes doesn't flash the
 * default "nocturne" theme for a frame before hydration applies the saved
 * one. Deliberately not a Client Component — this needs to run before
 * React even attaches.
 */
export function ThemeScript() {
  const script = `
    try {
      var t = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
      if (t && t !== "nocturne") document.documentElement.setAttribute("data-theme", t);
    } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

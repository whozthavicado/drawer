export type ThemeId =
  | "nocturne"
  | "esmeralda"
  | "ambar"
  | "cian"
  | "coral"
  | "terracota"
  | "bernumeno";

export type ThemeOption = {
  id: ThemeId;
  label: string;
  swatch: string;
  background: string;
};

export const THEME_STORAGE_KEY = "drawer:theme";

export const THEMES: ThemeOption[] = [
  { id: "nocturne", label: "Blurple", swatch: "#9184d9", background: "#0e0f18" },
  { id: "esmeralda", label: "Esmeralda", swatch: "#3f9c74", background: "#0e0f18" },
  { id: "ambar", label: "Ámbar", swatch: "#c9922f", background: "#0e0f18" },
  { id: "cian", label: "Cian", swatch: "#3596a8", background: "#0e0f18" },
  { id: "coral", label: "Coral", swatch: "#d1705f", background: "#0e0f18" },
  { id: "terracota", label: "Terracota", swatch: "#b06849", background: "#0e0f18" },
  { id: "bernumeno", label: "Bernumeno", swatch: "#c8a24a", background: "#141414" },
];

export function isThemeId(value: string | null): value is ThemeId {
  return !!value && THEMES.some((t) => t.id === value);
}

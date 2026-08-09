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
  { id: "esmeralda", label: "Esmeralda", swatch: "#10b981", background: "#0e0f18" },
  { id: "ambar", label: "Ámbar", swatch: "#eab308", background: "#0e0f18" },
  { id: "cian", label: "Cian", swatch: "#06b6d4", background: "#0e0f18" },
  { id: "coral", label: "Coral", swatch: "#f43f5e", background: "#0e0f18" },
  { id: "terracota", label: "Terracota", swatch: "#f97316", background: "#0e0f18" },
  { id: "bernumeno", label: "Bernumeno", swatch: "#d4af37", background: "#000000" },
];

export function isThemeId(value: string | null): value is ThemeId {
  return !!value && THEMES.some((t) => t.id === value);
}

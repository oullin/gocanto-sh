export type ThemePreference = "system" | "dark" | "light"
export type ResolvedTheme = "dark" | "light"
export type AccentColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "amber"
  | "orange"
  | "rose"
  | "pink"
  | "purple"
  | "violet"
  | "fuchsia"
  | "indigo"
  | "teal"
  | "cyan"
  | "emerald"
  | "slate"
  | "zinc"
  | "neutral"

export const themeStorageKey = "gocanto-sh-theme"
export const accentStorageKey = "gocanto-sh-accent"

export const themeSurfaceColor: Record<ResolvedTheme, { background: string; foreground: string }> = {
  dark: {
    background: "#09090b",
    foreground: "#fafafa",
  },
  light: {
    background: "#ffffff",
    foreground: "#18181b",
  },
}

export const themeColor: Record<ResolvedTheme, string> = {
  dark: themeSurfaceColor.dark.background,
  light: themeSurfaceColor.light.background,
}

export const accentOptions: { label: string; value: AccentColor }[] = [
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Red", value: "red" },
  { label: "Yellow", value: "yellow" },
  { label: "Amber", value: "amber" },
  { label: "Orange", value: "orange" },
  { label: "Rose", value: "rose" },
  { label: "Pink", value: "pink" },
  { label: "Purple", value: "purple" },
  { label: "Violet", value: "violet" },
  { label: "Fuchsia", value: "fuchsia" },
  { label: "Indigo", value: "indigo" },
  { label: "Teal", value: "teal" },
  { label: "Cyan", value: "cyan" },
  { label: "Emerald", value: "emerald" },
  { label: "Slate", value: "slate" },
  { label: "Zinc", value: "zinc" },
  { label: "Neutral", value: "neutral" },
]

const accentValues = new Set<AccentColor>(accentOptions.map((option) => option.value))

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "dark" || value === "light"
}

export function isAccentColor(value: string | null): value is AccentColor {
  return accentValues.has(value as AccentColor)
}

export function getResolvedTheme(theme: ThemePreference, systemPrefersDark: boolean): ResolvedTheme {
  return theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme
}

export function applyThemeToDocument(resolvedTheme: ResolvedTheme, selectedAccent: AccentColor) {
  const surfaceColor = themeSurfaceColor[resolvedTheme]

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
  document.documentElement.style.colorScheme = resolvedTheme
  document.documentElement.style.backgroundColor = surfaceColor.background
  document.documentElement.style.color = surfaceColor.foreground
  document.documentElement.dataset.accent = selectedAccent
  document.querySelector<HTMLMetaElement>("meta[name='theme-color']")?.setAttribute("content", themeColor[resolvedTheme])
}

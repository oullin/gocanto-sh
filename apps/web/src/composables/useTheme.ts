import { computed, onMounted, onUnmounted, ref, watch } from "vue"

export type ThemePreference = "system" | "dark" | "light"
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

const storageKey = "gocanto-sh-theme"
const accentStorageKey = "gocanto-sh-accent"
const themeColor = {
  dark: "#09090b",
  light: "#ffffff",
} as const

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

const accentPalette: Record<
  AccentColor,
  {
    hue?: number
    chroma?: number
    darkChroma?: number
    lightForeground?: string
  }
> = {
  blue: { hue: 259.8 },
  green: { hue: 142.5, chroma: 0.16 },
  red: { hue: 25.3 },
  yellow: { hue: 95.7, chroma: 0.13, darkChroma: 0.13, lightForeground: "oklch(0.145 0 0)" },
  amber: { hue: 70.1, chroma: 0.14, darkChroma: 0.13, lightForeground: "oklch(0.145 0 0)" },
  orange: { hue: 47.6, chroma: 0.17 },
  rose: { hue: 12.2 },
  pink: { hue: 0.7 },
  purple: { hue: 305.8 },
  violet: { hue: 293.4 },
  fuchsia: { hue: 322.2 },
  indigo: { hue: 277.1 },
  teal: { hue: 181.9, chroma: 0.14 },
  cyan: { hue: 224.3, chroma: 0.13 },
  emerald: { hue: 162.5, chroma: 0.15 },
  slate: { hue: 257.4, chroma: 0.04, darkChroma: 0.04 },
  zinc: { hue: 286.1, chroma: 0.02, darkChroma: 0.02 },
  neutral: {},
}

const preference = ref<ThemePreference>("system")
const accent = ref<AccentColor>("neutral")
const systemPrefersDark = ref(false)
const isMounted = ref(false)

let mediaQuery: MediaQueryList | undefined

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "dark" || value === "light"
}

function isAccentColor(value: string | null): value is AccentColor {
  return accentOptions.some((option) => option.value === value)
}

function getResolvedTheme(theme: ThemePreference) {
  return theme === "system" ? (systemPrefersDark.value ? "dark" : "light") : theme
}

function updateThemeColor(resolvedTheme: "dark" | "light") {
  document.querySelector<HTMLMetaElement>("meta[name='theme-color']")?.setAttribute("content", themeColor[resolvedTheme])
}

function applyTheme() {
  if (!isMounted.value) {
    return
  }

  const resolvedTheme = getResolvedTheme(preference.value)

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
  document.documentElement.style.colorScheme = resolvedTheme
  applyAccent(resolvedTheme)
  updateThemeColor(resolvedTheme)
}

export function useTheme() {
  const resolvedTheme = computed(() => getResolvedTheme(preference.value))

  function setTheme(theme: ThemePreference) {
    preference.value = theme
    localStorage.setItem(storageKey, theme)
  }

  function setAccent(nextAccent: AccentColor) {
    accent.value = nextAccent
    localStorage.setItem(accentStorageKey, nextAccent)
  }

  onMounted(() => {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    systemPrefersDark.value = mediaQuery.matches

    const storedTheme = localStorage.getItem(storageKey)
    const storedAccent = localStorage.getItem(accentStorageKey)

    if (isThemePreference(storedTheme)) {
      preference.value = storedTheme
    }

    if (isAccentColor(storedAccent)) {
      accent.value = storedAccent
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    isMounted.value = true
    applyTheme()
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener("change", handleSystemThemeChange)
  })

  return {
    accent,
    preference,
    resolvedTheme,
    setAccent,
    setTheme,
  }
}

function applyAccent(resolvedTheme: "dark" | "light") {
  const style = document.documentElement.style
  const selectedAccent = accent.value
  const selectedPalette = accentPalette[selectedAccent]

  document.documentElement.dataset.accent = selectedAccent

  if (!selectedPalette.hue) {
    style.removeProperty("--primary")
    style.removeProperty("--primary-foreground")
    style.removeProperty("--accent")
    style.removeProperty("--accent-foreground")
    style.removeProperty("--ring")
    return
  }

  const chroma = selectedPalette.chroma ?? 0.18
  const darkChroma = selectedPalette.darkChroma ?? 0.16
  const hue = selectedPalette.hue
  const primary = resolvedTheme === "dark" ? `oklch(0.72 ${darkChroma} ${hue})` : `oklch(0.58 ${chroma} ${hue})`
  const mutedAccent = resolvedTheme === "dark" ? `oklch(0.31 ${darkChroma * 0.52} ${hue})` : `oklch(0.95 ${chroma * 0.2} ${hue})`
  const foreground =
    resolvedTheme === "dark" ? "oklch(0.145 0 0)" : (selectedPalette.lightForeground ?? "oklch(0.985 0 0)")

  style.setProperty("--primary", primary)
  style.setProperty("--primary-foreground", foreground)
  style.setProperty("--accent", mutedAccent)
  style.setProperty("--accent-foreground", resolvedTheme === "dark" ? "oklch(0.985 0 0)" : "oklch(0.205 0 0)")
  style.setProperty("--ring", primary)
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  systemPrefersDark.value = event.matches
  applyTheme()
}

watch([preference, accent, systemPrefersDark], applyTheme)

import { computed, onMounted, onUnmounted, ref, watch } from "vue"

import {
  accentStorageKey,
  applyThemeToDocument,
  getResolvedTheme,
  isAccentColor,
  isThemePreference,
  themeStorageKey,
  type AccentColor,
  type ThemePreference,
} from "@/lib/theme"

export { accentOptions, type AccentColor, type ThemePreference } from "@/lib/theme"

const preference = ref<ThemePreference>("system")
const accent = ref<AccentColor>("rose")
const systemPrefersDark = ref(false)
const isMounted = ref(false)

let mediaQuery: MediaQueryList | undefined

function applyTheme() {
  if (!isMounted.value) {
    return
  }

  applyThemeToDocument(getResolvedTheme(preference.value, systemPrefersDark.value), accent.value)
}

export function useTheme() {
  const resolvedTheme = computed(() => getResolvedTheme(preference.value, systemPrefersDark.value))

  function setTheme(theme: ThemePreference) {
    preference.value = theme
    localStorage.setItem(themeStorageKey, theme)
  }

  function setAccent(nextAccent: AccentColor) {
    accent.value = nextAccent
    localStorage.setItem(accentStorageKey, nextAccent)
  }

  onMounted(() => {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    systemPrefersDark.value = mediaQuery.matches

    const storedTheme = localStorage.getItem(themeStorageKey)
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

function handleSystemThemeChange(event: MediaQueryListEvent) {
  systemPrefersDark.value = event.matches
  applyTheme()
}

watch([preference, accent, systemPrefersDark], applyTheme)

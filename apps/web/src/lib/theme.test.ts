import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { applyThemeToDocument } from "@/lib/theme"

class TestClassList {
  private readonly classes = new Set<string>()

  contains(className: string) {
    return this.classes.has(className)
  }

  toggle(className: string, force?: boolean) {
    const shouldAdd = force ?? !this.classes.has(className)

    if (shouldAdd) {
      this.classes.add(className)
    } else {
      this.classes.delete(className)
    }

    return shouldAdd
  }
}

describe("applyThemeToDocument", () => {
  const originalDocument = globalThis.document
  let classList: TestClassList
  let metaThemeColor: string | undefined

  beforeEach(() => {
    classList = new TestClassList()
    metaThemeColor = undefined

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        documentElement: {
          classList,
          dataset: {},
          style: {},
        },
        querySelector: (selector: string) => {
          if (selector !== "meta[name='theme-color']") {
            return null
          }

          return {
            setAttribute: (name: string, value: string) => {
              if (name === "content") {
                metaThemeColor = value
              }
            },
          }
        },
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: originalDocument,
    })
  })

  it("syncs light theme state onto the document", () => {
    applyThemeToDocument("dark", "zinc")
    applyThemeToDocument("light", "zinc")

    expect(classList.contains("dark")).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe("light")
    expect(document.documentElement.style.backgroundColor).toBe("#ffffff")
    expect(document.documentElement.style.color).toBe("#18181b")
    expect(document.documentElement.dataset.accent).toBe("zinc")
    expect(metaThemeColor).toBe("#ffffff")
  })

  it("syncs dark theme state onto the document", () => {
    applyThemeToDocument("light", "neutral")
    applyThemeToDocument("dark", "neutral")

    expect(classList.contains("dark")).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe("dark")
    expect(document.documentElement.style.backgroundColor).toBe("#09090b")
    expect(document.documentElement.style.color).toBe("#fafafa")
    expect(document.documentElement.dataset.accent).toBe("neutral")
    expect(metaThemeColor).toBe("#09090b")
  })

  it("syncs rose accent state onto the document", () => {
    applyThemeToDocument("light", "rose")

    expect(document.documentElement.dataset.accent).toBe("rose")
  })
})

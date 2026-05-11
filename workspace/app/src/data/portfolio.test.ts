import { describe, expect, it } from "vitest"

import {
  connectChannels,
  faqs,
  features,
  industries,
  journeyTabs,
  navLinks,
} from "@data"

describe("portfolio data", () => {
  it("exposes the expected number of sections", () => {
    expect(features).toHaveLength(6)
    expect(faqs).toHaveLength(5)
    expect(journeyTabs).toHaveLength(3)
    expect(industries.length).toBeGreaterThan(0)
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it("provides a route for every nav link", () => {
    for (const link of navLinks) {
      expect(link.href.startsWith("#")).toBe(true)
    }
  })

  it("uses a well-formed href for every connect channel", () => {
    for (const channel of connectChannels) {
      expect(channel.href).toMatch(/^(https?:|mailto:)/)
      expect(channel.handle.length).toBeGreaterThan(0)
    }
  })
})

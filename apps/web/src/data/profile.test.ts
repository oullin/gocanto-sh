import { describe, expect, it } from "vitest"

import { links, profile, proofLinks, skills, technologySkills, technologySkillsLabel } from "@data"

describe("profile content", () => {
  it("keeps the primary identity and required public links in place", () => {
    expect(profile.shortName).toBe("Gus Ocanto")
    expect(profile.location).toBe("Singapore")
    expect(links.map((link) => link.href)).toEqual(
      expect.arrayContaining([
        "https://www.linkedin.com/in/gocanto/",
        "https://github.com/gocanto",
        "https://gocanto.dev",
      ]),
    )
    expect(proofLinks).toHaveLength(2)
  })

  it("represents the requested technical positioning", () => {
    expect(profile.title).toContain("Software Architect")
    expect(skills).toEqual(
      expect.arrayContaining(["Go", "Node.js", "TypeScript", "PHP", "JavaScript", "Fintech", "Payments"]),
    )
    expect(technologySkillsLabel).toBe(`${technologySkills.slice(0, -1).join(", ")}, and ${technologySkills.at(-1)}`)
  })
})

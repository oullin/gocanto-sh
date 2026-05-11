export const technologySkills = [
  "Go",
  "Node.js",
  "TypeScript",
  "PHP",
  "Java",
  "JavaScript",
] as const

export const domainSkills = [
  "Banking",
  "Fintech",
  "Payments",
  "E-commerce",
  "Healthtech",
  "Cybersecurity",
] as const

export const skills = [...technologySkills, ...domainSkills] as const

const formatList = (items: readonly string[]) => {
  if (items.length <= 1) {
    return items[0] ?? ""
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`
}

export const technologySkillsLabel = formatList(technologySkills)

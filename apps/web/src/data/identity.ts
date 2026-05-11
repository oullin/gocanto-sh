import type { ProofLink } from "@data/types"

const avatarUrl = `${import.meta.env.BASE_URL}avatar.jpg`

export const profile = {
  name: "Gustavo Ocanto",
  shortName: "Gus Ocanto",
  handle: "gocanto",
  title: "Software Architect & Engineering Leader",
  location: "Singapore",
  pronouns: "he/him",
  avatarUrl,
  intro:
    "I build production-grade software with teams that need dependable architecture, pragmatic delivery, and systems that keep working when the easy part is over.",
  leftStatement: "I’m Gus, a software architect and engineering leader.",
  rightStatement: "Production-grade systems. Clear technical judgment.",
  journey: [
    "I’m a software architect and engineering leader with over two decades of building production-grade software across banking, fintech, cross-border payments, e-commerce, healthtech, e-wallets, and cybersecurity. I’ve worked as Head of Engineering, Engineering Lead, and Founding Engineer with companies in Singapore and beyond.",
    "My work sits where product ambition meets operational reality: architecture, backend systems, reliability, delivery discipline, and the technical tradeoffs that decide whether a system survives production. I’ve shipped banking systems, payment infrastructure, and high-performance backends using Go, TypeScript, Java, PHP, JavaScript, and Node.js.",
    "AI has changed what teams can produce quickly. It has not changed what remains hard: knowing what to build, how to build it safely, and what breaks at scale. I help teams turn engineering output into software that is maintainable, observable, secure, and ready for real users.",
  ],
  cta: {
    heading: "Let’s Build Something Solid",
    description:
      "If you need architecture review, engineering leadership, or help turning a prototype into production-grade software, I’m available for focused conversations and collaboration.",
    primary: {
      label: "Connect on LinkedIn",
      href: "https://www.linkedin.com/in/gocanto/",
    },
    secondary: {
      label: "View GitHub",
      href: "https://github.com/gocanto",
    },
  },
  contact:
    "For architecture, fractional engineering leadership, or production readiness work, reach out through LinkedIn.",
} as const

export const proofLinks: ProofLink[] = [
  {
    label: "Singapore-based engineering leader",
    href: "https://www.linkedin.com/in/gocanto/",
  },
  {
    label: "Open source and public profile",
    href: "https://github.com/gocanto",
  },
]

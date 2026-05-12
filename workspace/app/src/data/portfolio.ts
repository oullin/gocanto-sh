import type {
  AboutCopy,
  CtaCopy,
  FaqItem,
  Feature,
  FooterCopy,
  JourneyTab,
  NavLink,
  ProfileCardCopy,
} from "@data/types"

export const navLinks: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "FAQ", href: "#faq" },
  { label: "Connect", href: "#connect" },
]

export const profileCardCopy: ProfileCardCopy = {
  role: "Software Architect",
  flag: { emoji: "🇸🇬", label: "Singapore" },
  knowMore: { label: "Know more", href: "#about" },
}

export const aboutCopy: AboutCopy = {
  paragraphs: [
    {
      text:
        "I'm a software architect and engineering leader based in Singapore. Two decades shipping production systems for banking, fintech, payments, e-commerce, healthtech, and cybersecurity — the kind of work that has to keep working at 3am.",
    },
    {
      text:
        "Currently working with teams as Head of Engineering, fractional engineering lead, and founding engineer — turning prototypes into production-grade software, and production-grade software into platforms that scale.",
    },
  ],
  cta: { label: "See the journey", href: "#journey" },
}

export const industries = [
  "Banking",
  "Fintech",
  "Payments",
  "E-wallets",
  "E-commerce",
  "Healthtech",
  "Cybersecurity",
] as const

export const features: Feature[] = [
  {
    icon: "architecture",
    title: "Architecture & system design",
    description:
      "Service boundaries, data flows, and tradeoffs that let small teams ship and large systems scale. Event-driven, idempotent, observable by default.",
  },
  {
    icon: "backend",
    title: "Backend & payment infrastructure",
    description:
      "Banking ledgers, cross-border rails, e-wallets and high-throughput APIs. Built for correctness, audited for compliance, instrumented for the 3am incident.",
  },
  {
    icon: "leadership",
    title: "Engineering leadership",
    description:
      "Head of Engineering, Engineering Lead, Founding Engineer. I turn output into outcomes: delivery discipline, on-call hygiene, technical strategy that compounds.",
  },
  {
    icon: "reliability",
    title: "Reliability & operations",
    description:
      "SLOs, error budgets, runbooks. Make the system observable, incidents boring, and every regression a one-time event with a postmortem worth reading.",
  },
  {
    icon: "security",
    title: "Security & compliance",
    description:
      "Cybersecurity background applied to real-world threat models — secrets, identity, audit trails. PCI, KYC, AML adjacent work without slowing delivery.",
  },
  {
    icon: "ai",
    title: "AI-augmented delivery",
    description:
      "AI changed what teams can produce quickly. It hasn't changed what's hard — knowing what to build, building it safely, and what breaks at scale.",
  },
]

export const journeyHeading = {
  eyebrow: "The journey",
  title: "Two decades of shipping things that have to keep working.",
  lead:
    "I've worked as Head of Engineering, Engineering Lead, and Founding Engineer across banking, fintech, payments, e-commerce, healthtech, and cybersecurity — in Singapore and beyond.",
  highlights: [
    "Ledger design with strong consistency guarantees",
    "Multi-rail PSP orchestration & settlement pipelines",
    "Compliance-aware data architecture (KYC, AML, PCI)",
    "High-traffic commerce & healthtech backends",
  ],
  stack: ["Go", "TypeScript", "Node.js", "Java", "PHP"],
} as const

export const journeyTabs: JourneyTab[] = [
  {
    key: "banking",
    label: "banking",
    stack: ["Go", "Java", "Postgres"],
    entries: [
      { label: "role:", value: '"Head of Engineering"' },
      { label: "domain:", value: '"Core banking · Ledger"' },
      { label: "scale:", value: "millions of accounts" },
      { label: "guarantees:", value: "strong consistency" },
      { label: "uptime:", value: "99.99%" },
      { label: "launched:", value: "multi-region failover" },
    ],
  },
  {
    key: "payments",
    label: "payments",
    stack: ["Go", "TS", "Kafka"],
    entries: [
      { label: "role:", value: '"Engineering Lead"' },
      { label: "domain:", value: '"Cross-border payments"' },
      { label: "throughput:", value: "high-volume TPS" },
      { label: "routing:", value: "multi-PSP orchestration" },
      { label: "corridors:", value: "APAC ↔ EU ↔ US" },
      { label: "recon:", value: "automated reconciliation" },
    ],
  },
  {
    key: "commerce",
    label: "commerce",
    stack: ["TS", "PHP", "Node"],
    entries: [
      { label: "role:", value: '"Founding Engineer"' },
      { label: "domain:", value: '"Commerce · Healthtech"' },
      { label: "focus:", value: "APIs at peak load" },
      { label: "privacy:", value: "end-to-end & auditable" },
      { label: "security:", value: "threat-modelled by default" },
      { label: "delivery:", value: "weekly to production" },
    ],
  },
]

export const faqs: FaqItem[] = [
  {
    question: "What kind of engagements work best?",
    answer:
      "Architecture reviews, fractional engineering leadership, founding-engineer work, and \"turn-the-prototype-into-production\" engagements. Anything where the bottleneck is technical judgment, not just headcount.",
  },
  {
    question: "Remote, hybrid, or on-site?",
    answer:
      "Based in Singapore (UTC+8), comfortable working remote with global teams. Happy to travel for offsites, kickoffs, and the moments where being in the room matters.",
  },
  {
    question: "Which domains do you take on?",
    answer:
      "Strongest in banking, fintech, cross-border payments, and e-wallets. Also shipped at scale in e-commerce, healthtech, and cybersecurity. Production rigor transfers across all of them.",
  },
  {
    question: "How do you think about AI in the stack?",
    answer:
      "As a multiplier, not a strategy. AI accelerates what teams produce; it doesn't change what's hard — knowing what to build, building it safely, and keeping it observable.",
  },
  {
    question: "What's the fastest way to start?",
    answer:
      "A short intro on LinkedIn with the problem you're trying to solve. From there we usually do a 30-minute scoping call before deciding whether the engagement is a fit.",
  },
]

export const connectHeading = {
  eyebrow: "Connect",
  title: "Find me on the web as",
  highlight: "@gocanto",
  trailing: ".",
  subtitle: "LinkedIn is best for engagement inquiries. Pick whichever channel fits the conversation.",
} as const

export const ctaCopy: CtaCopy = {
  title: "Let's build something that lasts.",
  subtitle:
    "Architecture reviews, fractional engineering leadership, or turning a prototype into production-grade software.",
  primary: { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/gocanto/" },
  secondary: { label: "View GitHub", href: "https://github.com/gocanto" },
}

export const footerCopy: FooterCopy = {
  status: "All systems operational · Singapore",
  copyright: "© 2026 Gus — Software Architect & Engineering Leader",
  tagline: "Built with discipline. Designed for production.",
}

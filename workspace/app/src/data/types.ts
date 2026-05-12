export type IconName =
  | "linkedin"
  | "github"
  | "globe"
  | "bluesky"
  | "gravatar"
  | "mail"

export type ConnectChannel = {
  name: string
  handle: string
  description: string
  href: string
  icon: IconName
}

export type FeatureIcon =
  | "architecture"
  | "backend"
  | "leadership"
  | "reliability"
  | "security"
  | "ai"

export type Feature = {
  icon: FeatureIcon
  title: string
  description: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type JourneyTabKey = "banking" | "payments" | "commerce"

export type JourneyEntry = {
  label: string
  value: string
}

export type JourneyTab = {
  key: JourneyTabKey
  label: string
  entries: JourneyEntry[]
  stack: readonly string[]
}

export type NavLink = {
  label: string
  href: string
  external?: boolean
}

export type ProfileCardCopy = {
  role: string
  flag: { emoji: string; label: string }
  knowMore: { label: string; href: string; external?: boolean }
}

export type AboutLink = {
  match: string
  href: string
  external?: boolean
}

export type AboutParagraph = {
  text: string
  links?: AboutLink[]
}

export type AboutCopy = {
  paragraphs: AboutParagraph[]
  cta: { label: string; href: string; external?: boolean }
}

export type CtaCopy = {
  title: string
  subtitle: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}

export type FooterCopy = {
  status: string
  copyright: string
  tagline: string
}


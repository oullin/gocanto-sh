export type IconName = "github" | "linkedin" | "threads" | "bluesky" | "globe" | "x"

export type ProfileLink = {
  label: string
  href: string
  description: string
  icon: IconName
}

export type ProofLink = {
  label: string
  href: string
}

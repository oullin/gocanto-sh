<script setup lang="ts">
import { computed } from "vue"

import SectionCorners from "@components/SectionCorners.vue"
import { aboutCopy } from "@data"
import type { AboutLink, AboutParagraph } from "@data"

type Token =
  | { kind: "text"; value: string }
  | { kind: "link"; value: string; href: string; external: boolean }

function tokenize(p: AboutParagraph): Token[] {
  if (!p.links?.length) return [{ kind: "text", value: p.text }]
  let tokens: Token[] = [{ kind: "text", value: p.text }]
  for (const link of p.links) {
    tokens = tokens.flatMap((t) => splitOnLink(t, link))
  }
  return tokens
}

function splitOnLink(token: Token, link: AboutLink): Token[] {
  if (token.kind !== "text") return [token]
  const idx = token.value.indexOf(link.match)
  if (idx === -1) return [token]
  const before = token.value.slice(0, idx)
  const after = token.value.slice(idx + link.match.length)
  const out: Token[] = []
  if (before) out.push({ kind: "text", value: before })
  out.push({
    kind: "link",
    value: link.match,
    href: link.href,
    external: Boolean(link.external),
  })
  if (after) out.push({ kind: "text", value: after })
  return out
}

const paragraphs = computed(() => aboutCopy.paragraphs.map(tokenize))
</script>

<template>
  <section id="about" class="relative border-b border-border px-6 py-14">
    <SectionCorners />
    <div class="mx-auto flex max-w-page flex-col items-center gap-7">
      <div
        class="w-full max-w-[640px] border border-dashed border-border-strong bg-background px-[26px] py-[22px] font-mono text-[13.5px] leading-[1.65] text-fg-2 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)] [&>p+p]:mt-3 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:text-foreground"
      >
        <p v-for="(tokens, i) in paragraphs" :key="i">
          <template v-for="(token, j) in tokens" :key="j">
            <a
              v-if="token.kind === 'link'"
              :href="token.href"
              :target="token.external ? '_blank' : undefined"
              :rel="token.external ? 'noreferrer' : undefined"
            >{{ token.value }}</a>
            <template v-else>{{ token.value }}</template>
          </template>
        </p>
      </div>
      <a
        class="inline-flex cursor-pointer items-center gap-2 rounded-[7px] border border-transparent bg-foreground px-[18px] py-2.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-black transition-all duration-150 hover:bg-white"
        :href="aboutCopy.cta.href"
        :target="aboutCopy.cta.external ? '_blank' : undefined"
        :rel="aboutCopy.cta.external ? 'noreferrer' : undefined"
      >
        {{ aboutCopy.cta.label }}
      </a>
    </div>
  </section>
</template>

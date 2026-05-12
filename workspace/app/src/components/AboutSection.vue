<script setup lang="ts">
import { computed } from "vue"

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
  <section class="about" id="about">
    <span class="corner-r" aria-hidden="true"></span>
    <span class="corner-l" aria-hidden="true"></span>
    <div class="about-inner">
      <div class="about-card">
        <p v-for="(tokens, i) in paragraphs" :key="i" class="about-p">
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
        class="btn btn-primary about-cta"
        :href="aboutCopy.cta.href"
        :target="aboutCopy.cta.external ? '_blank' : undefined"
        :rel="aboutCopy.cta.external ? 'noreferrer' : undefined"
      >
        {{ aboutCopy.cta.label }}
      </a>
    </div>
  </section>
</template>

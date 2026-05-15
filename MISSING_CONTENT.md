# Missing content from `oullin/web`

Audit of what `oullin/web` (public firm site) carries that the personal portfolio
`gocanto-sh` does not. Scope: page copy in `oullin/web/storage/fixtures/*.json`
and `site.json`. Data (skills, projects, recommendations) is **not** static in
`oullin/web` — it comes from `oullin/api` — so this audit only covers copy.

Source repo: <https://github.com/oullin/web>

---

## Portable wins (recommended)

### 1. Hero `dataBlocks` — credibility metrics

**Missing from:** `workspace/app/src/components/ProfileHero.vue`
**Source:** `oullin/web/storage/fixtures/home-page.json` → `hero.dataBlocks`

Four side-by-side blocks Oullin uses below the hero headline:

| Tag | Value | Note |
| --- | --- | --- |
| `// experience.depth` | `20+ years` | "Software, consulting, architecture, and technical management." |
| `// banking.depth` | `10+ years in banking` | "Built for regulated, high-trust, and operationally demanding environments." |
| `// strategic.themes` | list | "AI Engineering Judgment", "Regulated Systems", "Architecture & Leadership" |
| `// operating.range` | quote | "Banking, consulting, product, and AI-first companies under real constraints." |

Local hero currently has only a name + one paragraph. These blocks are the
biggest substantive omission — credibility numbers a personal portfolio
typically wants front-and-centre.

---

### 2. Recommendations module — intro copy

**Missing from:** `workspace/app/src/components/RecommendationsMarquee.vue`
**Source:** `oullin/web/storage/fixtures/site.json` → `recommendations`

```
triggerLabel : "People"
intro        : "who have worked with Gustavo across architecture, delivery, and leadership."
dialog.title : "Recommendations"
dialog.desc  : "People who have worked with Gustavo across architecture, delivery, and leadership."
```

Local marquee renders the cards but carries no framing header. Trivial to add.

---

### 3. Footer — specialism marquee + tagline

**Missing from:** `workspace/app/src/components/SiteFooter.vue`
**Source:** `oullin/web/storage/fixtures/site.json` → `footer`

- **Brand line:** `OULLIN // MOVEMENT // CRAFT`
- **Tagline:** `MOVEMENT IS NOT OPTIONAL.`
- **Specialism marquee (10 items):**
  `Banking`, `High Availability`, `Architecture`, `Consulting`,
  `AI Transformation`, `AI-First Products`, `Technical Management`,
  `Modernization`, `Regulated Systems`, `Software Delivery`.
- **Back-to-top label.**

Local footer has Work / Open Source / Connect columns + "Husband, Father,
Brother, and Son" status. The personal status is appropriately different in
voice; the marquee row is additive.

---

## Possible bug surfaced during the audit

**`workspace/app/src/components/SiteNav.vue:14`** points
`<a href="#writing">Writing</a>` at an anchor that doesn't appear to exist in
`workspace/app/src/App.vue`. Same risk for `#about`, `#recommendations`,
`#contact` — `App.vue` mounts components but doesn't declare matching anchor
ids. Confirm at runtime; if the links jump to nothing, either add ids to the
section wrappers or wire the nav to the component roots.

---

## Not portable (intentional scope differences)

These sections exist in `oullin/web` but are firm-voice or duplicate the
personal site's positioning. Listed for completeness — **do not port without
explicit intent**.

### Home page — `principles` trio
`home-page.json` → `principles` carries three cards (Availability /
Transformation / Leadership) with firm-voice copy. The personal site uses
`SkillsSpotlight.vue` (Agentic AI / Banking & Fintech / E-Commerce) in the
same real estate, which reads better for a personal portfolio.

### Home page — `aiEra` + engagements
`home-page.json` → `aiEra` introduces the three primary engagements
(Sprint / Fractional / Hardening) with firm-voice copy. The personal
`EngagementCta.vue` deliberately pitches **Oullin Labs sub-brands**
(`hara.sh` / `kuda.sh` / `toku.sh`) instead. Porting the firm framing would
conflict with the current positioning.

### Whole pages absent locally

| Fixture | What it contains |
| --- | --- |
| `about-page.json` | Founder's note, "How We Work" essay, firm origin story (Ollin → Oullin). |
| `contact-page.json` | 48-hour response policy, 4-step process, best-fit projects/environments. |
| `work-with-us-page.json` | 4 detailed engagements (Sprint $8k, Fractional $8k/mo, Hardening $15k+, Enablement $6k), FAQ, closing CTA. |
| `writing-page.json` | "Field notes from real systems." hero + filter sidebar — pairs with `oullin/content` (25+ blog posts). |
| `terms-and-policies-page.json` | Legal. |

The most plausible candidate to port if scope expands later is **Writing** —
`oullin/content` already has 25+ posts authored by Gustavo, and the local
nav already advertises a Writing link that currently has no destination.

---

## Data layer — `oullin/api` cross-check

`oullin/web` ships only response **types** in `src/stores/api/response/*.ts`:

```ts
ProfileSkillResponse  = { uuid, percentage, item, description }
ProjectsResponse      = { uuid, sort, language, title, excerpt, url, icon, is_open_source, published_at }
RecommendationsResponse = { uuid, relation, text, created_at, person }
```

The actual rows live in `oullin/api/storage/fixture/{profile,projects,recommendations}.json`.
Diffed against `workspace/data/src/{profile,projects,recommendations}.ts`:

| Fixture | API count | Local count | Verdict |
| --- | --- | --- | --- |
| `profile.json` skills | 40 | 46 | Local is ahead — 1 renamed, 6 added (see below). Nothing dropped. |
| `projects.json` | 23 | 23 | **All match by title.** Nothing missing. |
| `recommendations.json` | 37 | 37 | **All match by uuid.** Nothing missing. (Jarek Tkaczyk legitimately appears twice in both, different uuids.) |

### Profile metadata

| Field | `oullin/api` | local `profile.ts` | Note |
| --- | --- | --- | --- |
| `version` | `1.0.2` | `1.0.3` | local ahead |
| `profession` | `Founder of Oullin` | `Software Architect & Principal Engineer` | intentional personal-voice change |
| `nickname` / `handle` / `name` / `email` | identical | identical | — |

### Skills delta

**Renamed locally:**
- `AS400` (API, generic IBM description, 30%) → `AS/400 Modernisation` (local, 90%, marked `signature: true` with rich `long_description` / `related_tech` / `example_projects` about banking-core wrapping).

**Added locally (not in API, all marked `signature: true`):**
- Agentic Orchestration
- Audit-Trail Architecture
- Idempotency & Retry Design
- Kafka Event Pipelines
- LLM Tooling
- Payment Integration

**Upgraded locally (same name, API only has `{uuid, percentage, item, description}`; local extends with `signature`, `years`, `long_description`, `related_tech`, `example_projects`):**
- Leadership (80% → 92%)
- Go (Programming Language) (kept 95%)
- System Design (kept 95%)
- E-commerce Architecture (kept 92%)
- AI (Artificial Intelligence) (80% → 92%)

**Dropped from API → not present locally:** none.

### Verification commands

```bash
# Re-fetch API fixtures
gh api repos/oullin/api/contents/storage/fixture/profile.json         --jq '.content' | base64 -d > /tmp/api-profile.json
gh api repos/oullin/api/contents/storage/fixture/projects.json        --jq '.content' | base64 -d > /tmp/api-projects.json
gh api repos/oullin/api/contents/storage/fixture/recommendations.json --jq '.content' | base64 -d > /tmp/api-recommendations.json

# Diff skill names (will print API-only names; expect: AS400)
diff <(jq -r '.data.skills | map(.item) | .[]' /tmp/api-profile.json | sort) \
     <(grep -oE '"item": "[^"]+"' workspace/data/src/profile.ts | sed 's/"item": "//;s/"$//' | sort)

# Diff project titles (expect: empty)
diff <(jq -r '.data | map(.title) | .[]' /tmp/api-projects.json | sort) \
     <(grep -oE '"title": "[^"]+"' workspace/data/src/projects.ts | sed 's/"title": "//;s/"$//' | sort)

# Diff recommendation uuids (expect: empty)
diff <(jq -r '.data | map(.uuid) | .[]' /tmp/api-recommendations.json | sort) \
     <(grep -oE '"uuid": "[a-f0-9-]+"' workspace/data/src/recommendations.ts | sed 's/"uuid": "//;s/"$//' | sort)
```

`oullin/web` has 38 recommendation **avatar images** in
`public/images/recommendation/`; the corresponding text/structured data lives
in `oullin/api/storage/fixture/recommendations.json` (covered above).

---

## Verification commands

```bash
# List every file in oullin/web
gh api "repos/oullin/web/git/trees/main?recursive=1" --jq '.tree[].path'

# Re-read any fixture
gh api repos/oullin/web/contents/storage/fixtures/home-page.json \
  --jq '.content' | base64 -d
```

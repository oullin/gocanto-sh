---
title: Deleting a feature is a graph problem
date: 2026-07-23
updated: 2026-07-23
description: "I built four SEO landing pages and deleted them 92 minutes later. Removing the pages was one commit. Removing everything that believed in them was the afternoon."
tags: [seo, refactoring, vercel, deploys]
---

The feature my branch is named after lived for 92 minutes.

```
13:59  feat: build profile authority pages
15:31  refactor: drop the authority pages, split page metadata, and prune docs
```

That is not a story about wasted work. Deleting the pages was easy and I do not regret
building them. What I did not expect was the second commit being four times the size of
the first, because a feature is not the files that implement it. It is every other place
in the system that has been told it exists.

## The plan was more URLs

My profile site is one page. Everything a search engine could know about me lived at
`gocanto.sh/`, competing with itself for every query at once.

The obvious fix is more surfaces. So I built four: a public HTML resume at `/resume`, and
three expertise pages at `/expertise/regulated-ai-systems`,
`/expertise/banking-core-modernisation`, and `/expertise/payment-systems`. One canonical
`Person` entity, each page pointing back at it, each linking out to the articles that
prove the claim.

The machinery was small and I liked it. A store fixture describing the pages, a registry
resolving path to record, one `AuthorityPage.vue` rendering all four, and the prerender
step walking the registry instead of a hardcoded list:

```ts
const routes = [
    { path: "/", file: "index.html" },
    ...AppPageRegistry.all().map((page) => ({
        path: page.path,
        file: `${page.path.slice(1)}.html`,
    })),
];
```

Then I read them back as a stranger would. Four thin pages restating a CV I had already
published, wrapped around links to articles that said the same thing better. They were not
proof. They were furniture arranged to look like proof, and a reader would clock that
faster than a crawler.

So they went.

## The pages were three files. The belief in them was everywhere

Deleting the implementation took a minute: `AuthorityPage.vue` at 172 lines,
`page-registry.ts` at 17, the store fixture at 188. Another 352 lines of `.authority-*`
and `.resume-*` CSS went with them, since nothing else had ever used it. Call it 729 lines,
gone, no argument.

Then I went looking for everything that still pointed at them.

| Where | What it still claimed |
| --- | --- |
| Nine post frontmatters | `expertise` and `expertiseLabel` keys naming a dead page |
| The writing author aside | Links to `/resume` and an expertise page, plus dead `.wr-author__links` rules |
| The writing `llms.txt` | A resume entry, for machines that would fetch it |
| Site nav and footer | `Resume` and `Payment systems` |
| `sitemap.xml` | Four URLs asking to be crawled |
| `README.md` | A link to `docs/seo-rollout.md`, and a sitemap description promising five canonical HTML URLs |

Not one of those lives in a file called `AuthorityPage.vue`. Every one of them would have
shipped: four 404s in the sitemap I had just handed to Google, dead links in the byline of
every article, a machine-readable index advertising a page that no longer resolved, and a
README describing a site that no longer existed.

A feature is its edges. The implementation is the part that shows up in the diff.

The compiler caught exactly one of these, the import of the deleted registry. Everything
else was a string in a Markdown file, a JSON entry, a nav array, a line of prose. The
tooling that would have caught them is the tooling that treats content as part of the
build, which mostly does not exist by default.

## The guard outlived the feature

The one piece of that work I would build again on purpose is the build guard, and it is
worth explaining why, because it survived the thing it was written for.

The public resume was generated from the same store as my private CV. Same file, one
curated slice for the web. That is efficient and it is exactly how you accidentally publish
your phone number. So the guard asserts absence:

```ts
if (/@gmail\.com|\+65[\s-]*\d{4}[\s-]*\d{4}|>References?</i.test(html)) {
    throw new Error(`[seo-guard] private CV contact or reference content found on ${path}`);
}
```

The first version of that matched my actual phone number, which meant the check that existed
to keep my number off a public page was carrying my number around in a public repository.
Matching the shape instead is both less embarrassing and a stronger assertion: it fails on
any phone number, not just the one I remembered to add.

Alongside the ordinary assertions: exactly one `<h1>`, exactly one canonical link, exactly
one JSON-LD block, and the page canonicalising to itself rather than to whatever URL I last
copied from another file.

When the resume was deleted, the guard did not break. It got shorter. The route list
collapsed to one entry and every assertion still ran against the one page left. A check
written against a property of the output rather than a property of the feature keeps
working when the feature does not.

## The sitemap got smaller on purpose

The other real decision was to stop advertising the machine-readable surface.

`gocanto.sh` serves a Markdown twin of every section plus an `llms.txt` index, which is
genuinely useful and which I had duly listed in the sitemap: eleven URLs, nine of them
plain-text near-duplicates of one HTML page. I was asking Google to index both versions of
everything I wrote and then hoping it picked correctly.

The sitemap is now one URL. The Markdown and `llms.txt` are still served, still linked,
still fetchable, with one header:

```json
{
    "source": "/(.*)\\.md",
    "headers": [{ "key": "X-Robots-Tag", "value": "noindex, follow" }]
}
```

`noindex` keeps them out of the index. `follow` keeps the links inside them working, so
nothing downstream loses credit for being cited. Anything that actually wants `llms.txt`
already knows the convention and does not need a sitemap to find it.

A sitemap is a request, not a description. Everything you put in it is something you are
asking to have ranked, and asking for two versions of one page is not twice the coverage.

## Two files knew my name

Small one, same shape. The canonical `Person` identifier was declared in
`structured-data.ts` and again in `page-metadata.ts`. Both were correct that afternoon.
Nothing anywhere connected them, so the first time one changed I would have shipped two
Persons with near-identical names and no way to tell a crawler which was me.

```ts
export const SITE_URL = "https://gocanto.sh/";
export const PERSON_ID = `${SITE_URL}#person`;
```

One file, imported by both. Entity resolution is the entire point of structured data, and
you cannot resolve to one entity from two definitions that are only equal by coincidence.

## What it cost

Honesty about the trade, since I spent a whole post recently getting this policy to
`script-src 'self'`: adding conversion tracking widened it again.

```
script-src 'self' https://va.vercel-scripts.com
connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com
```

Two hosts I do not control, executing on my origin, because I wanted to know whether any of
this works. That is a real cost and I would rather write it down than let it slide in under
a commit named "add analytics". If the numbers turn out not to change a decision I make,
the honest move is to take the hosts back out.

## What the second commit taught me

The 92 minutes were not the mistake. Building the pages is how I found out they were
furniture; I could have argued about it for a week instead and been less sure.

The lesson is in the second commit:

- **Deleting is a graph traversal.** Before removing a route, grep for its path, its slug,
  its label, and its title across content, config, navigation, sitemaps, machine-readable
  indexes, and docs. The implementation files are the smallest node.
- **Write guards against outputs, not features.** "This page has one canonical" survives a
  rewrite. "These four pages exist" is a check you delete alongside the thing it guarded.
- **Ask what you are requesting, not what you are serving.** A sitemap entry is a request
  to rank. Serving a file and advertising it are separate decisions, and `noindex, follow`
  is the one that keeps a resource useful without asking it to compete.
- **One definition per identity.** Two files agreeing today is not one source of truth. It
  is a bug with a delay on it.

The version with four extra pages would have deployed
perfectly. Green build, valid markup, clean Lighthouse, a sitemap full of URLs. It just
would have been four more pages of me claiming to be good at things, in a repository whose
whole premise is that the writing is the proof.

---

_This continues from [Merging is not shipping](/merging-is-not-shipping), which covers the
deploy layer this SEO work sits on top of. The site is a pnpm monorepo on Vercel and the
whole thing is public. I run [Oullin](https://oullin.io), where a lot of the work is
deciding which parts of a system should not exist. Find me on
[X (@gocanto)](https://x.com/gocanto)._

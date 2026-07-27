---
title: Merging is not shipping
date: 2026-07-22
updated: 2026-07-22
description: "A green build, a clean merge, and nothing reached production. Six bugs that live in the gap between correct code and a working site, and why none of them showed up as an error."
tags: [deploys, vercel, csp, vitepress]
---

I merged a change to my writing site, waited, and reloaded the page. Nothing.

CI was green. The commit was on `main`. The site was up. Every signal said done, and
the change was nowhere. What followed was an afternoon of finding bugs that had been
live for days, none of which had ever produced an error.

That is the pattern worth writing down. A test suite proves your code does what you
wrote. It says nothing about whether the bytes a browser receives are the ones you
meant. Everything below lived in that gap.

## The merge that deployed nothing

My profile site and my writing site both build from one repository. The profile site
deployed on every push. The writing site did not, and I had never noticed, because I
had always deployed it by hand right after merging and assumed the two were connected.

They were not. Five deployments, every one of them a manual CLI run:

```
Age  Project                 Status   Environment  Username
1d   oullin/gocanto-writing  ● Ready  Production   otnacog
1d   oullin/gocanto-writing  ● Ready  Preview      otnacog
1d   oullin/gocanto-writing  ● Ready  Production   otnacog
```

The fix was to serve both domains from one project, so one push ships everything.
That turned out to be less trivial than it sounds.

## The filesystem wins

The obvious design: build both sites, put one in `app/`, one in `writing/`, and route
by hostname.

```json
{
    "source": "/(.*)",
    "has": [{ "type": "host", "value": "writing.example.com" }],
    "destination": "/writing/$1"
}
```

This does not work if either site sits at the output root, and the reason is one line
in the Vercel docs: precedence is given to the filesystem before rewrites are applied.

Both of my builds emit `/index.html`, `/assets/*`, and `/favicon.png`. A request to
`writing.example.com/assets/app.js` would find the profile site's `app.js` sitting at
the root and serve it, and the host rewrite would never run. The writing site would
quietly render with the wrong JavaScript.

So neither site can own the root. Both get mounted:

```
dist/
  app/      -> example.com
  writing/  -> writing.example.com
```

With the root empty, there is nothing for the filesystem to match, and the host rules
always decide. This is the kind of constraint you cannot reason your way to from first
principles. You either read it or you ship the bug.

I made the build assert it:

```ts
const strays = entries.filter((entry) => !mounts.includes(entry));

if (strays.length > 0) {
    throw new Error(`dist/ root must contain only ${mounts.join(", ")}`);
}
```

A future change that drops a file at the root now fails the build instead of silently
shadowing a hostname.

## Links that 404

While setting this up I checked the live site properly for the first time in a while.
The index linked to `/signed-webhooks`. That URL returned 404. `/signed-webhooks.html`
returned 200.

My only published post had been unreachable from its own index, in production, for
days. The site was up. The index rendered. The link was right there, and it was dead.

The cause was one missing line of config: the project had no `cleanUrls`, so the `.html`
suffix was required and nothing removed it.

Nothing reported this. Not the build, not the tests, not uptime monitoring, which
cheerfully confirmed the site returned 200 for the homepage. You find this class of bug
by requesting the URLs a reader would actually click.

## Headers that were never applied

Same session, same surprise:

```sh
curl -sI https://example.com/          # full set of security headers
curl -sI https://writing.example.com/  # nothing
```

My `vercel.json` sat at the repository root and defined a Content Security Policy, HSTS,
frame options, the lot. It was applied to one project and not the other, because the
second project never read it. I had written the policy, committed it, and believed it
was in force on both hosts. It was in force on one.

A security header you did not verify is a security header you do not have. The file
existing proves nothing. Only the response proves it.

## The hash that would break on the next post

This is my favourite one, because it had not broken yet.

To ship a strict `script-src 'self'`, you have to deal with inline scripts. The standard
move is to allow them by hash. VitePress emits three, so I could have pinned three
hashes and called it strict.

Look at what the third one contains:

```js
window.__VP_HASH_MAP__ = JSON.parse('{"index.md":"2IRdoHpj","signed-webhooks.md":"BEtc7ueY"}');
```

That is a map of every page on the site. Publish a post and its contents change. The
hash changes with it. The pinned hash stops matching, the browser blocks the script,
and the site breaks.

Not at deploy time. Not in CI. On the next thing I wrote, weeks later, with no obvious
connection between "I added a post" and "the site is broken."

So I did not pin hashes. The build moves the inline scripts into files instead:

```
9 inline scripts across 3 pages -> 2 content-addressed assets
```

The policy becomes `script-src 'self'` with nothing that drifts. The bodies are
identical across pages, so they collapse into two cacheable files, and the filename
changes with the content instead of a policy needing to.

The pass fails the build if any inline script survives it. When a future VitePress
upgrade changes this markup, the build breaks rather than production.

I got to watch it work. The production asset hash came out different from my local one,
because I had changed a page title in between and that altered the site data. Exactly
the churn that would have broken a pinned hash, absorbed without anyone noticing.

Design out the failure mode. Do not schedule it for later.

## The trailing slash

After deploying, I checked the redirect keeping the writing site on one canonical
hostname:

```
/writing                    -> 308  ok
/writing/signed-webhooks    -> 308  ok
/writing/                   -> 200  wrong
```

`/writing/:path*` matches `/writing` and `/writing/<slug>`, but not the bare
trailing-slash form. Two out of three URLs redirected, which is the worst possible
result, because spot-checking one of them tells you it works.

Test the boundaries. The empty case is a boundary.

## Two layers, and the gap between them

The last step was moving the domain between projects. Halfway through, the site went
down properly:

```
HTTP/2 404
x-vercel-error: DEPLOYMENT_NOT_FOUND
```

That error is worth learning to read. It does not mean the site is broken. It means DNS
worked, the request reached the platform, and no project claimed the hostname.

Adding a domain is two independent things:

1. **DNS**, which decides who answers for the name.
2. **Project assignment**, which decides what gets served once the request arrives.

A domain can only belong to one project at a time, so moving it means removing it from
the old one before adding it to the new one. In between, layer one answers and layer two
has no answer to give. That gap is unavoidable, and knowing it exists is the difference
between "expected, wait ten seconds" and "roll everything back."

## The shape every bug shared

The code was correct. The tests passed. The artifact on
disk was right. And what users received was wrong, because something between the build
and the browser was not what I assumed.

Four habits fall out of that:

- **Verify against the deployed thing.** Not the build output, not localhost. `curl` the
  URL a reader would click, and read the response headers.
- **Assert your invariants in the build.** If the routing depends on the output root
  being empty, make the build fail when it is not. Comments do not enforce anything.
- **Prefer designs with no moving parts over configuration that must be kept in sync.**
  A content-addressed filename cannot drift out of date. A pinned hash can.
- **A green pipeline proves your code is correct.** It does not prove your site works.
  Those are different claims, and only one of them is what you shipped.

Most of these had been live for days while every
dashboard I owned showed green. The site was up the whole time. It was just wrong, and
nothing in my tooling had any opinion about it.

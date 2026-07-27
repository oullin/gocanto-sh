---
title: Automating HTTP 103 Early Hints with Caddy
date: 2025-10-29
updated: 2026-07-27
description: "How the first Oullin deployment generated Caddy Early Hints from build assets, what that changed in the request path, and what still required measurement."
tags: [web-performance, caddy, http]
---

In 2025 the first Oullin web stack added build-time generation of HTTP 103 Early Hints in
[web PR 155](https://github.com/oullin/web/pull/155).

The problem was narrow. The final HTML named the CSS and JavaScript bundles, but a browser
could not discover those files until it received and parsed that response. An informational
103 response can advertise selected preload links while the server is still preparing the
final response.

```http
HTTP/1.1 103 Early Hints
Link: </assets/app.css>; rel=preload; as=style
Link: </assets/app.js>; rel=modulepreload; as=script
```

The browser may begin those fetches before the final `200 OK`. The final response still owns
the page and its normal `Link` metadata; the 103 is only an early signal.

## Generate hints from the build

Hashed asset names change between builds, so maintaining preload paths by hand would create a
stale configuration. The Oullin implementation inspected the frontend build output and
generated the Caddy fragment consumed by the deployment.

That kept one source of truth: the artifact being deployed. If the bundle changed from
`app-a1.css` to `app-b2.css`, the hints changed in the same build instead of waiting for a
person to notice.

The generator also needed to be selective. Preloading every chunk competes for bandwidth and
can make the important requests slower. The useful candidates are the assets required for
the initial route, with the correct `as` value and cross-origin attributes where applicable.

## Deployment details still matter

An Early Hints feature can appear correct in configuration and still do nothing:

- an intermediary may not forward informational responses;
- the browser may already have the asset cached;
- a mismatched `as` value can prevent reuse of the preload;
- the hinted asset may not be on the critical path;
- too many hints can compete with HTML, fonts, or the actual largest element.

Verification therefore has two parts. First, inspect the protocol path and confirm a 103
actually reaches a client. Second, compare a representative cold load with and without the
hints.

The original change established the generation and serving path. It did not establish a
universal performance number, so I would not claim one. The effect depends on response time,
network latency, cache state, and which assets the page needs.

## What remains useful

The durable idea is not “turn on 103.” It is that deployment metadata derived from hashed
artifacts should be generated from those artifacts and validated as part of the build.

Early Hints are one consumer of that rule. Precache manifests, integrity metadata, and
Content Security Policy assets benefit from the same refusal to maintain changing filenames
by hand.

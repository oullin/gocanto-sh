---
title: Go meets the monolith renaissance
date: 2026-04-05
updated: 2026-07-27
description: "Why Oullin built an Inertia server adapter for Go, what the protocol requires, and where a server-led application is a better fit than a separate API and frontend."
tags: [go, inertia, web]
---

In April 2026, Oullin published [`inertia-go`](https://github.com/oullin/inertia-go), a server-side adapter for using [Inertia](https://inertiajs.com/) with Go. The project has moved since the original announcement, so this is a record of the architectural choice and the current way to try it.

## The problem it addresses

A separately deployed API and browser application can be the right design. It is also a cost: two routers, a public data contract, duplicated validation concerns, and coordination across two release paths.

Inertia keeps routing, authorization, and data loading on the server. A handler names a frontend component and supplies its props. The first request receives an HTML shell; subsequent Inertia visits receive a page object that the client uses to replace the current component.

That fits applications where one team owns the server and browser code together. It is less suitable when mobile or third-party clients need an independent API, or when the frontend must ship on its own cadence.

## What the Go adapter has to do

The useful part is not the `Render` method by itself. A server adapter also has to implement the protocol around it:

- distinguish initial HTML requests from Inertia requests;
- set the `Vary` response header correctly;
- detect asset-version mismatches;
- support partial reloads and shared props;
- convert redirects after state-changing requests where required; and
- produce external-location responses in the form expected by the client.

The current repository contains separate packages for the core renderer, protocol types, prop resolution, middleware, response rendering, and test assertions. Those boundaries are more useful evidence than the original claim of “full compliance”: they make each behaviour inspectable and testable against the [Inertia protocol](https://inertiajs.com/the-protocol).

## Current installation and API

As of this revision, the module lives at `github.com/oullin/inertia-go/core` and its `go.mod` requires Go 1.26:

```sh
go get github.com/oullin/inertia-go/core
```

A minimal standard-library setup looks like this:

```go
package main

import (
    "log"
    "net/http"

    "github.com/oullin/inertia-go/core/httpx"
    "github.com/oullin/inertia-go/core/inertia"
)

func main() {
    app, err := inertia.New(`<!doctype html>
<html>
<head>{{ .inertiaHead }}</head>
<body>{{ .inertia }}<script src="/app.js"></script></body>
</html>`, inertia.WithVersion("v1"))
    if err != nil {
        log.Fatal(err)
    }

    page := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        err := app.Render(w, r, "Home", httpx.Props{
            "message": "Hello from Go",
        })
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    })

    mux := http.NewServeMux()
    mux.Handle("/", app.Middleware(page))
    log.Fatal(http.ListenAndServe(":8080", mux))
}
```

The adapter works at the `net/http` boundary, so routers that compose `http.Handler` can use the same middleware. The current API also includes typed prop helpers for deferred, optional, merge, and once-only values. Those are worth adopting only when the corresponding client behaviour is part of the application; they are not reasons to complicate a simple page.

## Running the repository demo

The repository includes a Go API and frontend demo. From a checkout with Go 1.26, Node, and pnpm available:

```sh
pnpm install
make demo
```

The `demo` target builds the workspace and starts the Go demo through Portless. This command is taken from the current Makefile, rather than the older single-module layout described in the first version of this post.

## The architectural boundary

Inertia does not turn a monolith into a universal interface. It removes an API boundary where that boundary has no independent consumer.

That is a good trade for an internal tool or a web product owned and deployed as one unit. It is a poor trade if an API is itself part of the product. The decision is about ownership and deployment, not whether monoliths or SPAs are fashionable.

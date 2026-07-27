---
title: Debugging a multi-layered Docker and Caddy deployment
date: 2025-11-15
updated: 2026-07-27
description: "How certificate trust, SNI and Host alignment, path rewriting, and handler order combined to produce 421 and 404 responses across two Caddy layers."
tags: [caddy, docker, mtls]
---

This is a record of a 2025 Oullin deployment incident. At the time, a browser request crossed two Caddy instances before reaching a Go endpoint:

```text
Cloudflare
  -> public API Caddy
  -> web Caddy /relay/*
  -> API Caddy :8443 over mTLS
  -> Go API
```

The current deployment no longer sends the browser-facing relay through every step in this chain. The debugging method remains useful because the failures appeared at different layers.

## The symptoms

The first direct request from the web container to the mTLS listener failed with `unknown ca`. After the certificates were synchronized, the end-to-end request returned `421 Misdirected Request`. Fixing that exposed a `404` from the Go API.

Those responses were sequential clues, not three versions of the same fault:

- `unknown ca` meant the server could not validate the presented client certificate;
- `421` meant the TLS server name and HTTP authority did not identify the same Caddy site; and
- `404` meant the request finally reached the application with the wrong path.

Starting at the browser would have hidden that progression. Each hop needed to be tested from the container that initiated it.

## First: establish certificate trust

The web proxy needed the client certificate, its private key, and the CA used by the API-side listener. The files mounted into the two Compose projects had drifted.

After replacing the stale bundle, we tested from inside the web container:

```sh
curl -v \
    --cert /etc/caddy/mtls/client.pem \
    --key /etc/caddy/mtls/client.key \
    --cacert /etc/caddy/mtls/ca.pem \
    https://oullin_proxy_prod:8443/api/generate-signature
```

This separated network resolution and certificate validation from the outer proxy rules. Certificate files remained read-only mounts; they were not copied into an image layer.

## Second: align SNI and Host

Caddy's [`strict_sni_host`](https://caddyserver.com/docs/caddyfile/options#strict-sni-host) check rejects a request when the TLS SNI and HTTP `Host` disagree. Caddy enables the strict behaviour by default when a site uses client authentication.

The relay connected to the Docker service name, but the forwarded authority described a different site. Both values had to name the upstream Caddy listener:

```text
reverse_proxy https://oullin_proxy_prod:8443 {
    header_up Host oullin_proxy_prod

    transport http {
        tls
        tls_server_name oullin_proxy_prod
        tls_client_auth /etc/caddy/mtls/client.pem /etc/caddy/mtls/client.key
        tls_trust_pool file /etc/caddy/mtls/ca.pem
    }
}
```

Setting only `header_up Host` could not change the server name already sent during the TLS handshake. Setting only `tls_server_name` still left Caddy with a different HTTP authority. The pair removed the `421`.

## Third: trace the path at every hop

The public browser called `/relay/generate-signature`, while the Go handler expected `/generate-signature`. The two proxy layers had accumulated both `/relay` and `/api` prefixes.

On the web side, the relay removed `/relay` and added `/api` before the mTLS hop:

```text
handle_path /relay/* {
    rewrite * /api{path}
    reverse_proxy https://oullin_proxy_prod:8443
}
```

On the API-side listener, the private handler removed `/api` before proxying:

```text
@signature path /api/generate-signature*

handle @signature {
    uri strip_prefix /api
    reverse_proxy api:8080
}
```

The duplicated prefix was the source of the `404`. Logging the URI immediately before each `reverse_proxy` made that visible.

`handle_path` strips its matched prefix automatically. That is convenient, but combining it with a later rewrite can make the final URI hard to infer. The [Caddy `handle_path` documentation](https://caddyserver.com/docs/caddyfile/directives/handle_path) is worth reading alongside the adapted configuration, not after deployment.

## Handler order and method guards

The relay accepted only the method needed by the signing endpoint. Preflight and POST handlers came before a fallback that returned `405`; the private listener returned `403` for every path outside its allowlist.

That order matters because a broad proxy can make a protected route public even when a more specific matcher exists elsewhere in the file. The final checks covered both allowed and denied requests.

## The verification sequence

We stopped treating a browser `200` as the only test and checked the path in this order:

1. Docker DNS and shared-network membership.
2. Direct mTLS request with the mounted certificates.
3. Matching TLS SNI and HTTP `Host`.
4. URI at each proxy boundary.
5. POST success and GET rejection.
6. Caddy formatting and validation in CI.
7. An end-to-end request through the public route.

The lesson was not a particular Caddy snippet. It was to identify which layer produced each response before editing the next one. In a proxy chain, a later failure can be evidence that the previous fix worked.

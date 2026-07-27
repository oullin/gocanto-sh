---
title: Shipping observability for Oullin infrastructure
date: 2025-11-13
updated: 2026-07-27
description: "A historical runbook for the Prometheus, Grafana, Postgres exporter, and internal metrics endpoints introduced for Oullin's single-host deployment."
tags: [observability, prometheus, grafana]
---

In November 2025, [Oullin API PR #158](https://github.com/oullin/api/pull/158) added a small monitoring stack to the existing Docker deployment. This article records that setup. Commands and image versions should be checked against the current repository before operating a live host.

## What was deployed

The stack had four scrape targets:

- the Go API's `/metrics` endpoint;
- Caddy metrics exposed through a dedicated internal listener;
- `postgres_exporter`; and
- Prometheus itself.

Prometheus stored the time series, while Grafana loaded its datasource and dashboards from files in the repository. The services shared Docker networks but did not publish the Prometheus, Grafana, or exporter ports on the public host interface.

That boundary was the important security property. Operators reached the UIs through an SSH tunnel rather than opening administrative dashboards to the internet.

## Repository-owned configuration

The current repository keeps the monitoring files under `infra/metrics`:

```text
infra/metrics/
├── grafana/
│   ├── dashboards/
│   ├── provisioning/
│   └── scripts/
└── prometheus/
    ├── provisioning/
    └── scripts/
```

The Prometheus configuration names separate jobs for Caddy, PostgreSQL, the API, and Prometheus. Grafana provisioning points to the in-network Prometheus address and loads dashboard JSON from source control.

This makes the dashboard definitions reviewable, but it does not make dashboard state disposable. Prometheus and Grafana still use persistent volumes, and their data needs a retention and backup policy.

## Starting and checking the stack

The repository's monitoring Makefile has distinct local and production targets. The safe sequence is:

1. inspect the rendered Compose configuration;
2. start the intended profile;
3. check container health;
4. inspect Prometheus targets; and
5. query each metrics endpoint from the network that is meant to reach it.

The exact target names have changed since the original post, so use:

```sh
make help
```

and the current `infra/makefile/monitor.mk` as the command reference. Do not copy a production command from this historical article without reviewing its inputs.

## Access through a tunnel

When the services bind only inside the deployment, an operator can forward them temporarily:

```sh
ssh \
    -L 3000:127.0.0.1:3000 \
    -L 9090:127.0.0.1:9090 \
    deployer@example-host
```

That example assumes the host exposes those ports on loopback. Verify the Compose bindings first; a container-only port may require forwarding through a different endpoint.

The tunnel is not a substitute for Grafana authentication. It narrows network exposure and should be paired with a strong, separately managed administrator credential.

## What the dashboards did not prove

A green target means Prometheus can scrape an endpoint. It does not prove that:

- the dashboard queries use metrics that the current exporter emits;
- alert thresholds describe user impact;
- data survives a container replacement; or
- an operator will notice a failure.

The repository later gained diagnostics for missing Caddy series because some dashboard queries referred to metrics that were not available. That is a useful correction to the original celebratory account: shipped configuration still needs failure drills.

For a single-host system, this stack is a reasonable starting point. The next work is operational—alerts, retention, restore tests, and ownership—not another dashboard.

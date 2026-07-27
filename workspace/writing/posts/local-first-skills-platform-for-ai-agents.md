---
title: Building a local-first skills platform for AI agents
date: 2026-02-19
updated: 2026-07-27
description: "A historical look at a local-first skills manager built around a Go CLI, controlled execution, shared sources, and explicit security boundaries."
tags: [ai-agents, developer-tools, security]
---

This is a record of the first version of Oullin's internal skills manager. The repository is
now private and the product has moved beyond the CLI described here, so this is an
architecture note rather than an installation guide.

The original problem was ordinary configuration drift. Agent skills lived in different
folders, teams copied them between projects, and an update in one place did not reach the
others. Installing an unfamiliar skill also meant trusting instructions and scripts before
anybody had inspected them.

The first system used a Go CLI, Docker-backed install and audit operations, Make targets, and
links from consuming projects to one managed source.

## Keep the source local

The manager installed skills into a controlled repository, then exposed selected skills to
Codex, Claude, and Gemini discovery directories. A project received links rather than copied
directories.

That gave updates one owner, but it also made link ownership part of the design. A tool that
manages filesystem links must be able to distinguish its own links from a developer's file or
an unrelated symlink. Replacing an unknown path because it occupies the desired destination
is not a convenience; it is data loss.

The current implementation records provenance for each managed link and refuses foreign or
changed paths. That is stricter than the first version, which treated complete agent
directories as mount points. The change came from treating uninstall and recovery as part of
the feature rather than cleanup after it.

## Put risky tooling behind an explicit boundary

Install and audit operations used containers to pin their toolchains and avoid requiring
every scanner or registry client on the host. This improves repeatability, but a container is
not automatically a security boundary.

In particular, mounting `docker.sock` gives a process control over the host Docker daemon.
Any workflow that does so should name that capability, require an explicit opt-in, and avoid
presenting “runs in Docker” as equivalent to isolation.

The audit path combined behavioural checks with YARA rules and failed when it found a
problem. Scanning was a gate before use, not proof that arbitrary instructions were safe.
Review, source trust, least privilege, and a reversible install path remained necessary.

## Why Go fitted the first version

The CLI mostly dealt with paths, links, command execution, manifests, and release artifacts.
Go provided a small deployable binary and enough standard-library support to keep those
operations explicit.

The language mattered less than the contracts:

- absolute, validated source and destination paths;
- no mutation before all conflicts and compatibility checks pass;
- provenance for everything the tool creates;
- validation and unmount operations that refuse ambiguous ownership;
- local execution by default;
- pinned dependencies for containerized operations.

The first version solved duplication. Later work showed that a dependable manager also needs
to own discovery, compatibility, provenance, and removal. That progression is the useful part
of the project history.

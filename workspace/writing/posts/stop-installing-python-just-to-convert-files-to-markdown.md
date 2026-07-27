---
title: Converting files to Markdown without a local Python setup
date: 2026-02-26
updated: 2026-07-27
description: "A Docker wrapper around Microsoft's MarkItDown, with deterministic input and output paths and a deliberately small Makefile interface."
tags: [developer-tools, markdown, docker]
---

[MarkItDown](https://github.com/microsoft/markitdown) is a Python tool from Microsoft for converting several document formats into Markdown. [`gocanto/to-markdown`](https://github.com/gocanto/to-markdown) puts a pinned MarkItDown release in a Docker image and exposes one conversion command.

The wrapper is useful when Docker is already part of a project and adding another host runtime is not.

## What the wrapper does

The repository fixes two directories:

```text
storage/input
storage/output
```

Given `storage/input/report.docx`, this command writes `storage/output/report.md`:

```sh
make convert file=report.docx
```

The Makefile validates the argument and input file, builds the Compose image if it is missing, runs MarkItDown, checks that the output exists, and prints the output path. Build and conversion logs stay quiet on success; failures include the tail of the relevant temporary log.

## Current setup

The current repository requires Docker with the Compose plugin and Make:

```sh
git clone https://github.com/gocanto/to-markdown.git
cd to-markdown
cp .env.example .env
mkdir -p storage/input storage/output
```

Copy a source file into `storage/input`, then pass its filename:

```sh
cp /path/to/report.docx storage/input/
make convert file=report.docx
```

Use a clean rebuild after changing the Dockerfile or pinned dependency:

```sh
make fresh
```

The environment file controls `FROM_DIR`, `TO_DIR`, `OUTPUT_EXT`, and `MARKITDOWN_VERSION`. At this revision, the wrapper defaults to MarkItDown 0.1.5.

## Upstream features and wrapper behaviour

Format support belongs to MarkItDown, not to this repository. Microsoft's current project documentation is the authority for supported inputs and optional dependencies. A format listed upstream may still need an extra dependency or service that this Docker image does not install.

The wrapper itself guarantees a narrower contract:

- one local input file;
- one requested Markdown output path;
- Docker-isolated execution; and
- a stable command-line entry point.

It does not expose every MarkItDown option, batch a directory, fetch remote URLs, or configure optional LLM-based media descriptions. Those would require explicit wrapper changes.

## When to use it

Docker is not free. The first build takes longer than a native command, and mounting files through a container complicates high-volume services. For a server-side conversion pipeline, call MarkItDown as a library or design a dedicated worker with resource limits.

For occasional local conversion, the wrapper removes Python environment management and makes the tool version visible in source control. That is the whole trade: a larger runtime dependency in exchange for a smaller host setup.

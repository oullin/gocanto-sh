SHELL := /bin/bash

ROOT_PATH := $(shell pwd)
GO_FMT_COMPOSE_FILE := go-fmt.compose.yaml
GO_FMT_SERVICE := go-fmt
GO_FMT_COMPOSE := docker compose -f $(GO_FMT_COMPOSE_FILE)
GO_FMT_BIN := /usr/local/bin/go-fmt
GO_FMT_EXEC := $(GO_FMT_COMPOSE) exec -T $(GO_FMT_SERVICE) $(GO_FMT_BIN)

.PHONY: dev format format-all go-fmt-check go-fmt-format go-fmt-start go-fmt-stop

dev:
	pnpm dev

format:
	pnpm --filter @gocanto/app exec oxlint . --fix
	pnpm format
	pnpm lint
	pnpm typecheck
	pnpm test

format-all:
	pnpm --filter @gocanto/app exec oxlint . --fix
	pnpm format-all
	pnpm lint
	pnpm typecheck
	pnpm test

go-fmt-check: go-fmt-start
	$(GO_FMT_EXEC) check --cwd $(ROOT_PATH) --host-path $(ROOT_PATH)

go-fmt-format: go-fmt-start
	$(GO_FMT_EXEC) format --cwd $(ROOT_PATH) --host-path $(ROOT_PATH)

go-fmt-start:
	$(GO_FMT_COMPOSE) up -d $(GO_FMT_SERVICE)

go-fmt-stop:
	$(GO_FMT_COMPOSE) stop $(GO_FMT_SERVICE)

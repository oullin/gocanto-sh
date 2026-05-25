SHELL := /bin/bash

ROOT_PATH := $(shell pwd)
GO_FMT_COMPOSE_FILE := go-fmt.compose.yaml
GO_FMT_SERVICE := go-fmt
GO_FMT_SUPPORT_SERVICE := go-fmt-support
GO_FMT_COMPOSE := docker compose -f $(GO_FMT_COMPOSE_FILE)
GO_FMT_BIN := /usr/local/bin/go-fmt
GO_FMT_EXEC := $(GO_FMT_COMPOSE) exec -T $(GO_FMT_SERVICE) $(GO_FMT_BIN)
GO_FMT_SUPPORT_EXEC := $(GO_FMT_COMPOSE) exec -T $(GO_FMT_SUPPORT_SERVICE)
GO_FMT_SUPPORT_ROOT := /opt/go-fmt
GO_FMT_SUPPORT_VITE_NODE := $(GO_FMT_SUPPORT_ROOT)/packages/support/node_modules/.bin/vite-node
GO_FMT_SUPPORT_OXFMT := $(GO_FMT_SUPPORT_ROOT)/packages/support/node_modules/.bin/oxfmt

.PHONY: dev format format-all go-fmt-format go-fmt-start go-fmt-stop ui-format ui-format-start ui-format-stop

dev:
	pnpm dev

format:
	pnpm --filter @gocanto/app exec oxlint . --fix
	$(MAKE) go-fmt-format
	$(MAKE) ui-format
	pnpm lint
	pnpm typecheck
	pnpm test

format-all:
	pnpm --filter @gocanto/app exec oxlint . --fix
	$(MAKE) go-fmt-format
	$(MAKE) ui-format
	pnpm lint
	pnpm typecheck
	pnpm test

go-fmt-format: go-fmt-start
	$(GO_FMT_EXEC) format --cwd $(ROOT_PATH) --host-path $(ROOT_PATH)

ui-format: ui-format-start
	$(GO_FMT_SUPPORT_EXEC) /bin/bash -lc 'cd /work && git ls-files --cached --others --exclude-standard -z -- "*.ts" "*.vue" | while IFS= read -r -d "" file; do [ -f "$$file" ] && printf "%s\0" "$$file"; done | xargs -0 -r $(GO_FMT_SUPPORT_VITE_NODE) --config $(GO_FMT_SUPPORT_ROOT)/packages/support/vite.config.ts $(GO_FMT_SUPPORT_ROOT)/packages/support/scripts/blank-lines.ts'
	$(GO_FMT_SUPPORT_EXEC) /bin/bash -lc 'cd /work && git ls-files --cached --others --exclude-standard -z | while IFS= read -r -d "" file; do [ -f "$$file" ] && printf "%s\0" "$$file"; done | xargs -0 -r $(GO_FMT_SUPPORT_OXFMT) --write --no-error-on-unmatched-pattern'

go-fmt-start:
	$(GO_FMT_COMPOSE) up -d $(GO_FMT_SERVICE)

go-fmt-stop:
	$(GO_FMT_COMPOSE) stop $(GO_FMT_SERVICE)

ui-format-start:
	$(GO_FMT_COMPOSE) up -d --build $(GO_FMT_SUPPORT_SERVICE)

ui-format-stop:
	$(GO_FMT_COMPOSE) stop $(GO_FMT_SUPPORT_SERVICE)

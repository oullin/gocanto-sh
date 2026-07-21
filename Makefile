SHELL := /bin/bash

ROOT_PATH := $(shell pwd)
FMTKIT := ./infra/scripts/fmtkit.sh

.PHONY: dev format format-all ui-format ui-format-check lint

dev:
	pnpm dev

format:
	$(FMTKIT) format .

format-all:
	$(FMTKIT) format-all

ui-format:
	$(FMTKIT) format-all

ui-format-check: ui-format
	@git diff --exit-code -- . || (echo "Formatting drift detected. Run 'make ui-format' and commit." && exit 1)

lint:
	$(FMTKIT) check .

SHELL := /bin/bash

ROOT_PATH := $(shell pwd)
FMTKIT := ./infra/scripts/fmtkit.sh

.PHONY: dev format format-all ui-format lint

dev:
	pnpm dev

format:
	$(FMTKIT) format .

format-all:
	$(FMTKIT) format-all

ui-format:
	$(FMTKIT) format-all

lint:
	$(FMTKIT) check .

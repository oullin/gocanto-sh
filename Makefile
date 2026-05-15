.PHONY: dev format format-all

dev:
	pnpm dev

format:
	pnpm --filter @gocanto/app exec oxlint . --fix
	pnpm lint
	pnpm typecheck
	pnpm test

format-all:
	pnpm format-all

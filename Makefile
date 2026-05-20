.PHONY: dev format format-all

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

.PHONY: dev format

dev:
	pnpm dev

format:
	pnpm --filter @gocanto/app exec oxlint . --fix
	pnpm lint
	pnpm typecheck
	pnpm test

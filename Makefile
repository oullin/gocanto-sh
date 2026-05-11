.PHONY: format

format:
	pnpm --filter @gocanto/web exec oxlint . --fix
	pnpm lint
	pnpm typecheck
	pnpm test

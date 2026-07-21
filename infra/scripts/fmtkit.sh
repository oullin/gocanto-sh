#!/usr/bin/env bash
set -euo pipefail

bin="${FMTKIT_BIN:-fmtkit}"
project_dir="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

if ! command -v "${bin}" >/dev/null 2>&1; then
	{
		printf 'error: fmtkit is not installed.\n\n'
		printf 'Install it on macOS with Homebrew:\n'
		printf '  brew tap oullin/fmtkit\n'
		printf '  brew install --cask fmtkit\n\n'
		printf 'On Linux, download the binary from GitHub Releases:\n'
		printf '  https://github.com/oullin/fmtkit/releases/latest\n'
	} >&2
	exit 1
fi

if [[ $# -eq 0 ]]; then
	printf 'usage: %s <format|format-all|check|version|help> [paths...]\n' "${0##*/}" >&2
	exit 2
fi

cd "${project_dir}"

mode="$1"

if [[ "$mode" == "check" ]]; then
	shift
	paths=("$@")
	if [[ ${#paths[@]} -eq 0 ]]; then
		paths=(.)
	fi

	"${bin}" check "${paths[@]}"
	"${bin}" lint "${paths[@]}"
	exit 0
fi

exec "${bin}" "$@"

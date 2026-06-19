#!/usr/bin/env bash
# Sync packages/design-system from the standalone ogcr-design-system repo (kept as upstream).
#
# Apple Git ships no `git subtree`, so we use the subtree *merge strategy option* instead, which is
# built into core git: it shifts the incoming tree under the prefix and records upstream history.
#
# Usage: pnpm ds:sync [remote] [branch]   (defaults: ds-upstream main)
set -euo pipefail

REMOTE="${1:-ds-upstream}"
BRANCH="${2:-main}"
PREFIX="packages/design-system"

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "Remote '$REMOTE' not found. Add it first, e.g.:" >&2
  echo "  git remote add $REMOTE \"/Users/kenji/Dropbox/Maji/20 OGCR/ogcr-design-system\"" >&2
  echo "  (or the GitHub URL: https://github.com/Maji-Studio/ogcr-design-system.git)" >&2
  exit 1
fi

echo "Fetching $REMOTE/$BRANCH ..."
git fetch "$REMOTE" "$BRANCH"

echo "Merging into $PREFIX/ via subtree strategy ..."
git merge -X "subtree=$PREFIX" "$REMOTE/$BRANCH" \
  -m "chore: sync design-system from $REMOTE/$BRANCH"

echo "Done. Review the diff, then: pnpm install && pnpm ds:build"

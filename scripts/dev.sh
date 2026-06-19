#!/usr/bin/env bash
#
# `pnpm dev` — run the design system in library-watch mode alongside farmer's
# Next.js dev server.
#
# The design system is consumed as the prebuilt `dist/` (workspace:* + the
# precompiled styles.css), so a DS source edit only reaches farmer after dist/
# rebuilds. `turbo watch build:lib` re-runs the FULL library pipeline on every DS
# source change — including `inject-use-client.mjs` (Rolldown strips in-source
# 'use client', so the post-build banner is what keeps the components RSC-safe)
# and the token/spacing/dist integrity checks. Expect a ~few-second rebuild after
# a DS edit, then refresh farmer. This is the "near-live" model; true TSX HMR via
# transpilePackages is intentionally deferred (see PLAN.md).
set -euo pipefail
cd "$(dirname "$0")/.."

# Ensure farmer has a fresh dist/ before it compiles (cheap turbo cache hit if the
# DS is unchanged; a real build on a cold checkout).
pnpm ds:build

# Rebuild the DS library on each source change, in the background.
pnpm ds:watch &
DS_WATCH_PID=$!

# Stop the watcher when farmer's dev server exits (Ctrl-C stops both).
trap 'kill "$DS_WATCH_PID" 2>/dev/null || true' EXIT INT TERM

# Farmer's dev server in the foreground.
pnpm --filter farmer-prototype dev

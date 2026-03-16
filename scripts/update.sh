#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "[omc] Updating oh-my-openclaw..."

# 1. Pull latest reference images
echo "[omc] Pulling latest OpenClaw images..."
docker pull alpine/openclaw:latest
docker pull ghcr.io/openclaw/openclaw

# 2. Update npm dependencies (refreshes @goplus/agentguard rules)
echo "[omc] Updating npm dependencies..."
npm install --prefix "$ROOT"

# 3. Re-validate all built-in skills with updated AgentGuard rules
echo "[omc] Re-validating skills with updated AgentGuard..."
node "$ROOT/scripts/validate.js" --all --strict

# 4. Rebuild Docker images
echo "[omc] Rebuilding Docker images..."
docker compose -f "$ROOT/docker/docker-compose.yml" build --no-cache

echo "[omc] Update complete."

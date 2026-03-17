#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "[omocw] Updating oh-my-openclaw..."

# 1. Pull latest reference images
echo "[omocw] Pulling latest OpenClaw images..."
docker pull alpine/openclaw:latest
docker pull ghcr.io/openclaw/openclaw

# 2. Update npm dependencies (refreshes @goplus/agentguard rules)
echo "[omocw] Updating npm dependencies..."
npm install --prefix "$ROOT"

# 3. Re-validate all built-in skills with updated AgentGuard rules
echo "[omocw] Re-validating skills with updated AgentGuard..."
node "$ROOT/scripts/validate.js" --all --strict

# 4. Rebuild Docker images
echo "[omocw] Rebuilding Docker images..."
docker compose -f "$ROOT/docker/docker-compose.yml" build --no-cache

echo "[omocw] Update complete."

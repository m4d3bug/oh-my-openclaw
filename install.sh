#!/usr/bin/env bash
# oh-my-openclaw installer
# Pulls reference images, installs deps, validates skills, links omocw CLI.
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "  oh-my-openclaw installer"
echo "  ========================"
echo ""

# 1. Docker check
if ! docker info &>/dev/null; then
  echo "[install] ERROR: Docker is not running."
  exit 1
fi

# 2. Pull reference images (used for validation and runtime)
echo "[install] Pulling OpenClaw images..."
docker pull alpine/openclaw:latest
docker pull ghcr.io/openclaw/openclaw

# 3. Install npm deps (includes @goplus/agentguard)
echo "[install] Installing npm dependencies..."
npm install --prefix "$ROOT"

# 4. Validate all built-in skills through AgentGuard
echo "[install] Validating skills with AgentGuard..."
node "$ROOT/scripts/validate.js" --all --strict

# 5. Link omocw CLI
echo "[install] Linking omocw CLI..."
chmod +x "$ROOT/scripts/omocw.js"
if command -v npm &>/dev/null; then
  npm link --prefix "$ROOT" 2>/dev/null || true
fi

# 6. Create default config if absent
CONFIG="$ROOT/config/openclaw.yml"
if [ ! -f "$CONFIG" ]; then
  cp "$ROOT/config/openclaw.example.yml" "$CONFIG"
  echo "[install] Created config: $CONFIG"
fi

echo ""
echo "[install] Done. Run: omocw start"
echo "          Host openclaw is untouched."
echo ""

#!/bin/bash
set -e

OMC_DIR=/omc
WORKSPACE=/workspace

echo "[oh-my-openclaw] Bootstrapping..."

# 1. Pull latest base images to ensure freshness
echo "[omc] Verifying base images..."
docker pull alpine/openclaw:latest 2>/dev/null || true
docker pull ghcr.io/openclaw/openclaw 2>/dev/null || true

# 2. Run AgentGuard validation on any user-provided skills
if [ -d "/omc/user-skills" ]; then
  echo "[omc] Validating user skills with AgentGuard..."
  node "$OMC_DIR/scripts/validate.js" --dir /omc/user-skills --strict
fi

# 3. Load oh-my-openclaw skill extensions into openclaw
if [ -f "$OMC_DIR/.openclaw/skills/oh-my-openclaw.js" ]; then
  export OPENCLAW_SKILL_PATH="$OMC_DIR/.openclaw/skills"
fi

# 4. Apply user config if provided (read-only mount, never modified)
if [ -d "/host-config" ]; then
  export OPENCLAW_CONFIG_OVERLAY=/host-config
fi

# 5. Start openclaw gateway
exec openclaw gateway \
  --port "${OPENCLAW_GATEWAY_PORT:-18789}" \
  --skill-path "$OMC_DIR/.openclaw/skills" \
  --agent-config "$OMC_DIR/config/agents.yml" \
  "$@"

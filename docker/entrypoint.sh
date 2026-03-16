#!/bin/bash
set -e

OMC_DIR=/omc

echo "[oh-my-openclaw] Starting..."

# Apply user config overlay if mounted (read-only, host config untouched)
if [ -d "/host-config" ]; then
  export OPENCLAW_CONFIG_OVERLAY=/host-config
fi

# Validate any user-provided skills at runtime before loading
if [ -d "/omc/user-skills" ]; then
  echo "[omc] Validating user skills with AgentGuard..."
  node "$OMC_DIR/scripts/validate.js" --dir /omc/user-skills --strict
fi

# Determine config file: prefer mounted runtime config, fall back to example
CONFIG_FILE="$OMC_DIR/config/openclaw.yml"
if [ ! -f "$CONFIG_FILE" ]; then
  CONFIG_FILE="$OMC_DIR/config/openclaw.example.yml"
fi

echo "[omc] Using config: $CONFIG_FILE"
echo "[omc] Skill path:   $OMC_DIR/skills"

exec openclaw gateway \
  --port "${OPENCLAW_GATEWAY_PORT:-18789}" \
  --config "$CONFIG_FILE" \
  --skill-path "$OMC_DIR/skills" \
  --agent-config "$OMC_DIR/config/agents.yml" \
  "$@"
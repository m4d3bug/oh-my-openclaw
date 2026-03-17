#!/bin/bash
set -e

OMOCW_DIR=/omocw
OC_SKILLS="/home/node/.openclaw/skills"

echo "[oh-my-openclaw] Starting..."

# Apply user config overlay if mounted (read-only, host config untouched)
if [ -d "/host-config" ]; then
  export OPENCLAW_CONFIG_OVERLAY=/host-config
fi

echo "[omocw] Bootstrapping openclaw..."

mkdir -p /home/node/.openclaw

# Generate config from environment variables
python3 /omocw/docker/gen-config.py > /home/node/.openclaw/openclaw.json

echo "[omocw] Config written."
cat /home/node/.openclaw/openclaw.json | python3 -c "
import sys, json
c = json.load(sys.stdin)
p = c.get('models', {}).get('providers', {})
for name, cfg in p.items():
    print(f'[omocw]   provider: {name}  api={cfg[\"api\"]}  url={cfg[\"baseUrl\"]}')
m = c.get('agents', {}).get('defaults', {}).get('model', {}).get('primary', '?')
print(f'[omocw]   model:    {m}')
print('[omocw]   channel:  telegram (polling)')
"

# Init default workspace
echo "[omocw] Initialising workspace..."
openclaw setup --non-interactive 2>/dev/null || mkdir -p /home/node/.openclaw/workspace

# Load agents / skills / workspace files from external URLs or local fallbacks
echo "[omocw] Fetching sources (agents, skills, workspace)..."
python3 /omocw/docker/fetch-sources.py
FETCH_EXIT=$?
if [ "$FETCH_EXIT" -eq 1 ]; then
    echo "[omocw] fetch-sources: some entries used local fallback"
elif [ "$FETCH_EXIT" -ge 2 ]; then
    echo "[omocw] fetch-sources: fatal error, aborting" >&2
    exit "$FETCH_EXIT"
fi

# ── Copy skills from mounted /omocw/skills/ into OpenClaw ──────────────────
# Skills are pre-installed on the host (by CI or install.sh) and mounted read-only.
mkdir -p "$OC_SKILLS"
SKILL_COUNT=0
for skill_dir in /omocw/skills/*/; do
    [ -f "${skill_dir}SKILL.md" ] || continue
    skill_name="$(basename "$skill_dir")"
    cp -r "$skill_dir" "$OC_SKILLS/$skill_name"
    echo "[omocw]   Loaded skill: $skill_name"
    SKILL_COUNT=$((SKILL_COUNT + 1))
done
echo "[omocw] $SKILL_COUNT skill(s) loaded"

# Create .learnings/ in workspace for self-improving-agent
mkdir -p /home/node/.openclaw/workspace/.learnings

# Enable full tools profile (web fetch, file operations, shell, etc.)
echo "[omocw] Setting tools.profile = full..."
openclaw config set tools.profile full 2>/dev/null || true

echo "[omocw] Starting gateway..."
exec openclaw gateway run --port "${OPENCLAW_GATEWAY_PORT:-18789}" --verbose

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

# ── Install ClawHub skills from skills.txt ─────────────────────────────────
mkdir -p "$OC_SKILLS"
if [ -f "/omocw/skills.txt" ]; then
    echo "[omocw] Installing ClawHub skills from skills.txt..."
    npm install -g clawhub 2>/dev/null || true
    SKILL_COUNT=0
    while IFS= read -r line; do
        line="${line%%#*}"           # strip comments
        line="$(echo "$line" | xargs)" # trim whitespace
        [ -z "$line" ] && continue

        FORCE_FLAG=""
        if echo "$line" | grep -q '\[force\]'; then
            FORCE_FLAG="--force"
            line="$(echo "$line" | sed 's/\[force\]//' | xargs)"
        fi

        echo "[omocw]   Installing: $line"
        clawhub install "$line" $FORCE_FLAG --workdir /tmp/omocw-skills --no-input 2>/dev/null || true

        # Copy to OpenClaw skills dir
        if [ -f "/tmp/omocw-skills/skills/$line/SKILL.md" ]; then
            cp -r "/tmp/omocw-skills/skills/$line" "$OC_SKILLS/$line"
            echo "[omocw]   OK: $line"
            SKILL_COUNT=$((SKILL_COUNT + 1))
        else
            echo "[omocw]   SKIP: $line (no SKILL.md)"
        fi
    done < /omocw/skills.txt
    echo "[omocw] $SKILL_COUNT ClawHub skill(s) installed"
fi

# ── Install GitHub-sourced skills from github-skills.txt ───────────────────
if [ -f "/omocw/github-skills.txt" ]; then
    echo "[omocw] Installing GitHub skills..."
    while IFS= read -r line; do
        line="${line%%#*}"
        line="$(echo "$line" | xargs)"
        [ -z "$line" ] && continue

        REPO_URL="$(echo "$line" | awk '{print $1}')"
        SKILL_PATH="$(echo "$line" | awk '{print $2}')"
        SKILL_NAME="$(echo "$line" | awk '{print $3}')"

        echo "[omocw]   Cloning: $SKILL_NAME from $REPO_URL"
        TMPDIR="/tmp/gh-skill-$SKILL_NAME"
        git clone --depth 1 "$REPO_URL" "$TMPDIR" 2>/dev/null || true

        if [ -f "$TMPDIR/$SKILL_PATH" ]; then
            mkdir -p "$OC_SKILLS/$SKILL_NAME"
            cp "$TMPDIR/$SKILL_PATH" "$OC_SKILLS/$SKILL_NAME/SKILL.md"
            echo "[omocw]   OK: $SKILL_NAME"
        else
            echo "[omocw]   SKIP: $SKILL_NAME (SKILL.md not found at $SKILL_PATH)"
        fi
        rm -rf "$TMPDIR"
    done < /omocw/github-skills.txt
fi

# Create .learnings/ in workspace for self-improving-agent
mkdir -p /home/node/.openclaw/workspace/.learnings

# Enable full tools profile (web fetch, file operations, shell, etc.)
echo "[omocw] Setting tools.profile = full..."
openclaw config set tools.profile full 2>/dev/null || true

echo "[omocw] Starting gateway..."
exec openclaw gateway run --port "${OPENCLAW_GATEWAY_PORT:-18789}" --verbose

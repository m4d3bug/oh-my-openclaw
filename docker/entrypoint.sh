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

echo "[omc] Bootstrapping openclaw..."

mkdir -p /home/node/.openclaw

# Generate config from environment variables
python3 /omc/docker/gen-config.py > /home/node/.openclaw/openclaw.json

echo "[omc] Config written."
cat /home/node/.openclaw/openclaw.json | python3 -c "
import sys, json
c = json.load(sys.stdin)
p = c.get('models', {}).get('providers', {})
for name, cfg in p.items():
    print(f'[omc]   provider: {name}  api={cfg[\"api\"]}  url={cfg[\"baseUrl\"]}')
m = c.get('agents', {}).get('defaults', {}).get('model', {}).get('primary', '?')
print(f'[omc]   model:    {m}')
print('[omc]   channel:  telegram (polling)')
"

# Init default workspace
echo "[omc] Initialising workspace..."
openclaw setup --non-interactive 2>/dev/null || mkdir -p /home/node/.openclaw/workspace

echo "[omc] Starting gateway..."
exec openclaw gateway run --port "${OPENCLAW_GATEWAY_PORT:-18789}" --verbose
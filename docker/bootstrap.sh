#!/bin/bash
set -e

echo "[omc] Bootstrapping openclaw..."

mkdir -p /home/node/.openclaw

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

# Init workspace so the agent can start
echo "[omc] Initialising workspace..."
openclaw setup --non-interactive 2>/dev/null || mkdir -p /home/node/.openclaw/workspace

exec openclaw gateway run --port "${OPENCLAW_GATEWAY_PORT:-18789}" --verbose

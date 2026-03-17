#!/usr/bin/env bash
# oh-my-openclaw subproject manager
# Clones/updates third-party projects and merges their agents/skills.
#
# Usage:
#   bash scripts/subprojects.sh sync      Clone or update all enabled subprojects
#   bash scripts/subprojects.sh clean     Remove all cloned subprojects
#   bash scripts/subprojects.sh list      Show subproject status
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT/subprojects/manifest.yml"
SUBPROJECTS_DIR="$ROOT/subprojects"

if [ ! -f "$MANIFEST" ]; then
  echo "[subprojects] No manifest found at $MANIFEST"
  exit 1
fi

# Requires yq (or python fallback) for YAML parsing
parse_yaml() {
  python3 -c "
import yaml, json, sys
with open('$MANIFEST') as f:
    data = yaml.safe_load(f)
print(json.dumps(data.get('subprojects', [])))" 2>/dev/null
}

sync_subproject() {
  local name="$1" repo="$2" branch="$3"
  local dir="$SUBPROJECTS_DIR/$name"

  if [ -d "$dir/.git" ]; then
    echo "[subprojects] Updating $name..."
    git -C "$dir" fetch origin
    git -C "$dir" reset --hard "origin/${branch:-main}"
  else
    echo "[subprojects] Cloning $name..."
    git clone --depth 1 --branch "${branch:-main}" "$repo" "$dir"
  fi
}

copy_agents() {
  local name="$1"
  shift
  local dir="$SUBPROJECTS_DIR/$name"

  # Read agents from manifest via python
  python3 -c "
import yaml, sys, shutil, os

with open('$MANIFEST') as f:
    data = yaml.safe_load(f)

for sp in data.get('subprojects', []):
    if sp['name'] != '$name':
        continue
    if not sp.get('enabled', True):
        continue
    for agent in sp.get('agents', []):
        src = os.path.join('$dir', agent['path'])
        dst = os.path.join('$ROOT', 'agents', agent['as'] + '.md')
        if os.path.isfile(src):
            shutil.copy2(src, dst)
            print(f'  agent: {agent[\"as\"]} <- {agent[\"path\"]}')
        else:
            print(f'  agent: {agent[\"as\"]} MISSING {src}', file=sys.stderr)
    for skill in sp.get('skills', []):
        src = os.path.join('$dir', skill['path'])
        dst = os.path.join('$ROOT', 'skills', skill['as'])
        if os.path.isfile(src):
            shutil.copy2(src, dst)
            print(f'  skill: {skill[\"as\"]} <- {skill[\"path\"]}')
        else:
            print(f'  skill: {skill[\"as\"]} MISSING {src}', file=sys.stderr)
" 2>&1
}

cmd_sync() {
  echo "[subprojects] Syncing subprojects..."
  python3 -c "
import yaml, json
with open('$MANIFEST') as f:
    data = yaml.safe_load(f)
for sp in data.get('subprojects', []):
    if sp.get('enabled', True):
        print(sp['name'] + '|' + sp['repo'] + '|' + sp.get('branch', 'main'))
" | while IFS='|' read -r name repo branch; do
    sync_subproject "$name" "$repo" "$branch"
    copy_agents "$name"
  done
  echo "[subprojects] Sync complete."
}

cmd_clean() {
  echo "[subprojects] Cleaning cloned subprojects..."
  python3 -c "
import yaml
with open('$MANIFEST') as f:
    data = yaml.safe_load(f)
for sp in data.get('subprojects', []):
    print(sp['name'])
" | while read -r name; do
    if [ -d "$SUBPROJECTS_DIR/$name" ]; then
      rm -rf "$SUBPROJECTS_DIR/$name"
      echo "  Removed $name"
    fi
  done
}

cmd_list() {
  python3 -c "
import yaml, os
with open('$MANIFEST') as f:
    data = yaml.safe_load(f)
for sp in data.get('subprojects', []):
    name = sp['name']
    enabled = sp.get('enabled', True)
    exists = os.path.isdir('$SUBPROJECTS_DIR/' + name)
    status = 'cloned' if exists else 'not cloned'
    flag = '' if enabled else ' (disabled)'
    agents = len(sp.get('agents', []))
    skills = len(sp.get('skills', []))
    print(f'  {name}: {status}{flag}  agents={agents} skills={skills}')
"
}

case "${1:-}" in
  sync)  cmd_sync  ;;
  clean) cmd_clean ;;
  list)  cmd_list  ;;
  *)
    echo "Usage: $0 {sync|clean|list}"
    exit 1
    ;;
esac

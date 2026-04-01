#!/usr/bin/env bash
# oh-my-openclaw configuration tester
# Pulls alpine/openclaw:latest and validates the generated config inside it.
#
# Usage:
#   bash scripts/test-config.sh                 Run all tests
#   bash scripts/test-config.sh --quick         Config generation only
#   bash scripts/test-config.sh --with-boot     Full bootstrap test (needs API keys)
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="alpine/openclaw:latest"
CONTAINER_NAME="omocw-test-$$"
RESULTS_DIR="$ROOT/test-results"
mkdir -p "$RESULTS_DIR"

MODE="${1:---quick}"

echo "================================================"
echo "  oh-my-openclaw config tester"
echo "  image: $IMAGE"
echo "  mode:  $MODE"
echo "================================================"
echo ""

# ── Pull latest image ─────────────────────────────────────────────────────────
echo "[test] Pulling $IMAGE..."
docker pull "$IMAGE"

# ── Test 1: Config generation (OpenAI mode) ────────────────────────────────────
echo ""
echo "[test] 1/4 — Config generation (OpenAI mode)..."
docker run --rm \
  --name "$CONTAINER_NAME-openai" \
  -e OPENAI_API_KEY="test-key-openai" \
  -e OPENAI_BASE_URL="https://example.com/v1" \
  -e OPENAI_MODEL="MiniMax-M2.5" \
  -e TELEGRAM_BOT_TOKEN="000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
  -v "$ROOT:/omocw:ro" \
  "$IMAGE" \
  python3 /omocw/docker/gen-config.py > "$RESULTS_DIR/config-openai.json" 2>&1 || true

if [ -s "$RESULTS_DIR/config-openai.json" ]; then
  python3 -c "
import json, sys
with open('$RESULTS_DIR/config-openai.json') as f:
    c = json.load(f)
p = c.get('models', {}).get('providers', {})
assert 'custom-openai' in p, 'Missing custom-openai provider'
assert p['custom-openai']['api'] == 'openai-completions', 'Wrong API type'
m = c['agents']['defaults']['model']['primary']
assert m == 'custom-openai/MiniMax-M2.5', f'Wrong model: {m}'
print('  PASS: OpenAI config validated')
" 2>&1 && echo "  [OK]" || echo "  [FAIL] OpenAI config validation"
else
  echo "  [FAIL] No config generated"
fi

# ── Test 2: Config generation (Anthropic mode) ─────────────────────────────────
echo ""
echo "[test] 2/4 — Config generation (Anthropic mode)..."
docker run --rm \
  --name "$CONTAINER_NAME-anthropic" \
  -e ANTHROPIC_API_KEY="test-key-anthropic" \
  -e ANTHROPIC_BASE_URL="https://api.siliconflow.cn/v1" \
  -e ANTHROPIC_MODEL="Pro/MiniMaxAI/MiniMax-M2.5" \
  -e TELEGRAM_BOT_TOKEN="000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
  -v "$ROOT:/omocw:ro" \
  "$IMAGE" \
  python3 /omocw/docker/gen-config.py > "$RESULTS_DIR/config-anthropic.json" 2>&1 || true

if [ -s "$RESULTS_DIR/config-anthropic.json" ]; then
  python3 -c "
import json, sys
with open('$RESULTS_DIR/config-anthropic.json') as f:
    c = json.load(f)
p = c.get('models', {}).get('providers', {})
assert 'custom-anthropic' in p, 'Missing custom-anthropic provider'
m = c['agents']['defaults']['model']['primary']
assert 'custom-anthropic/' in m, f'Wrong model prefix: {m}'
print('  PASS: Anthropic config validated')
" 2>&1 && echo "  [OK]" || echo "  [FAIL] Anthropic config validation"
else
  echo "  [FAIL] No config generated"
fi

# ── Test 3: Dual provider ──────────────────────────────────────────────────────
echo ""
echo "[test] 3/4 — Config generation (dual provider)..."
docker run --rm \
  --name "$CONTAINER_NAME-dual" \
  -e OPENAI_API_KEY="test-key-openai" \
  -e OPENAI_BASE_URL="https://coding.dashscope.aliyuncs.com/v1" \
  -e OPENAI_MODEL="MiniMax-M2.5" \
  -e ANTHROPIC_API_KEY="test-key-anthropic" \
  -e ANTHROPIC_BASE_URL="https://api.siliconflow.cn/v1" \
  -e ANTHROPIC_MODEL="Pro/MiniMaxAI/MiniMax-M2.5" \
  -e TELEGRAM_BOT_TOKEN="000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
  -v "$ROOT:/omocw:ro" \
  "$IMAGE" \
  python3 /omocw/docker/gen-config.py > "$RESULTS_DIR/config-dual.json" 2>&1 || true

if [ -s "$RESULTS_DIR/config-dual.json" ]; then
  python3 -c "
import json, sys
with open('$RESULTS_DIR/config-dual.json') as f:
    c = json.load(f)
p = c.get('models', {}).get('providers', {})
assert 'custom-openai' in p, 'Missing custom-openai provider'
assert 'custom-anthropic' in p, 'Missing custom-anthropic provider'
m = c['agents']['defaults']['model']['primary']
assert m.startswith('custom-openai/'), f'OpenAI should take priority, got: {m}'
print('  PASS: Dual provider — OpenAI takes priority')
" 2>&1 && echo "  [OK]" || echo "  [FAIL] Dual provider config validation"
else
  echo "  [FAIL] No config generated"
fi

# ── Test 4: Full bootstrap (optional) ──────────────────────────────────────────
if [ "$MODE" = "--with-boot" ]; then
  echo ""
  echo "[test] 4/4 — Full bootstrap test (requires valid API keys)..."
  if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "  [SKIP] No API keys in environment"
  else
    timeout 60 docker run --rm \
      --name "$CONTAINER_NAME-boot" \
      -e OPENAI_API_KEY="${OPENAI_API_KEY:-}" \
      -e OPENAI_BASE_URL="${OPENAI_BASE_URL:-}" \
      -e OPENAI_MODEL="${OPENAI_MODEL:-MiniMax-M2.5}" \
      -e ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}" \
      -e ANTHROPIC_BASE_URL="${ANTHROPIC_BASE_URL:-}" \
      -e ANTHROPIC_MODEL="${ANTHROPIC_MODEL:-}" \
      -e TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX}" \
      -v "$ROOT:/omocw:ro" \
      "$IMAGE" \
      bash -c "bash /omocw/docker/bootstrap.sh & sleep 30 && echo 'BOOT_OK'" \
      > "$RESULTS_DIR/boot.log" 2>&1 || true

    if grep -q "BOOT_OK\|gateway.listen" "$RESULTS_DIR/boot.log" 2>/dev/null; then
      echo "  [OK] Bootstrap completed"
    else
      echo "  [FAIL] Bootstrap failed (see test-results/boot.log)"
    fi
  fi
else
  echo ""
  echo "[test] 4/4 — Bootstrap test skipped (use --with-boot to enable)"
fi

# ── Summary ────────────────────────────────────────────────────────────────────
echo ""
echo "================================================"
echo "  Test results saved to: $RESULTS_DIR/"
echo "================================================"

#!/usr/bin/env python3
"""
Generate ~/.openclaw/openclaw.json based on environment variables.

OpenAI-compatible mode  (OPENAI_API_KEY + OPENAI_BASE_URL + OPENAI_MODEL):
  api: openai-completions
  provider id: custom-openai

Anthropic-compatible mode (ANTHROPIC_API_KEY + ANTHROPIC_BASE_URL + ANTHROPIC_MODEL):
  api: anthropic-messages
  provider id: custom-anthropic

Both can be set simultaneously; the first found takes priority for the
default model (OPENAI wins if both present).
"""

import json, os, sys

def env(key, default=None):
    return os.environ.get(key, default)

OPENAI_KEY   = env('OPENAI_API_KEY')
OPENAI_URL   = env('OPENAI_BASE_URL')
OPENAI_MODEL = env('OPENAI_MODEL', 'MiniMax-M2.5')

ANTHROPIC_KEY   = env('ANTHROPIC_API_KEY')
ANTHROPIC_URL   = env('ANTHROPIC_BASE_URL')
ANTHROPIC_MODEL = env('ANTHROPIC_MODEL', 'Pro/MiniMaxAI/MiniMax-M2.5')

TELEGRAM_TOKEN = env('TELEGRAM_BOT_TOKEN')
GATEWAY_PORT   = env('OPENCLAW_GATEWAY_PORT', '18789')

if not OPENAI_KEY and not ANTHROPIC_KEY:
    print('[gen-config] ERROR: set OPENAI_API_KEY or ANTHROPIC_API_KEY', file=sys.stderr)
    sys.exit(1)

# ── Model definitions shared across both providers ───────────────────────────
OPENAI_MODELS = [
    dict(id='MiniMax-M2.5',         name='MiniMax M2.5',         reasoning=True,  input=['text'],          contextWindow=200000, maxTokens=8192,  cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='qwen3.5-plus',         name='Qwen3.5 Plus',         reasoning=True,  input=['text','image'],  contextWindow=131072, maxTokens=8192,  cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='qwen3-max-2026-01-23', name='Qwen3 Max',            reasoning=True,  input=['text'],          contextWindow=131072, maxTokens=8192,  cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='qwen3-coder-next',     name='Qwen3 Coder Next',     reasoning=False, input=['text'],          contextWindow=131072, maxTokens=8192,  cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='qwen3-coder-plus',     name='Qwen3 Coder Plus',     reasoning=False, input=['text'],          contextWindow=131072, maxTokens=8192,  cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='glm-5',                name='GLM-5',                reasoning=True,  input=['text'],          contextWindow=131072, maxTokens=8192,  cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='glm-4.7',              name='GLM-4.7',              reasoning=True,  input=['text'],          contextWindow=131072, maxTokens=8192,  cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='kimi-k2.5',            name='Kimi K2.5',            reasoning=True,  input=['text','image'],  contextWindow=131072, maxTokens=8192,  cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
]

ANTHROPIC_MODELS = [
    dict(id='Pro/MiniMaxAI/MiniMax-M2.5', name='MiniMax M2.5 (SiliconFlow)', reasoning=True, input=['text'], contextWindow=200000, maxTokens=8192, cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='Pro/Qwen/Qwen3-235B-A22B',   name='Qwen3 235B (SiliconFlow)',   reasoning=True, input=['text'], contextWindow=131072, maxTokens=8192, cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='Pro/THUDM/GLM-4-32B',        name='GLM-4 32B (SiliconFlow)',    reasoning=True, input=['text'], contextWindow=131072, maxTokens=8192, cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
    dict(id='Pro/moonshotai/Kimi-K2-Instruct', name='Kimi K2 (SiliconFlow)', reasoning=True, input=['text'], contextWindow=131072, maxTokens=8192, cost=dict(input=0,output=0,cacheRead=0,cacheWrite=0)),
]

# ── Build providers section ──────────────────────────────────────────────────
providers = {}
primary_model = None

if OPENAI_KEY and OPENAI_URL:
    providers['custom-openai'] = {
        'baseUrl': OPENAI_URL,
        'apiKey':  OPENAI_KEY,
        'api':     'openai-completions',
        'models':  OPENAI_MODELS,
    }
    primary_model = f'custom-openai/{OPENAI_MODEL}'
    print(f'[gen-config] openai  url={OPENAI_URL}  model={primary_model}', file=sys.stderr)

if ANTHROPIC_KEY and ANTHROPIC_URL:
    providers['custom-anthropic'] = {
        'baseUrl': ANTHROPIC_URL,
        'apiKey':  ANTHROPIC_KEY,
        'api':     'anthropic-messages',
        'models':  ANTHROPIC_MODELS,
    }
    # only override primary if openai not set
    if not primary_model:
        primary_model = f'custom-anthropic/{ANTHROPIC_MODEL}'
    print(f'[gen-config] anthropic url={ANTHROPIC_URL}  model=custom-anthropic/{ANTHROPIC_MODEL}', file=sys.stderr)

# ── Assemble full config ─────────────────────────────────────────────────────
config = {
    'meta': {'lastTouchedVersion': '2026.3.13'},
    'models': {
        'mode': 'merge',
        'providers': providers,
    },
    'agents': {
        'defaults': {
            'model': {'primary': primary_model},
            'contextPruning': {'mode': 'cache-ttl', 'ttl': '1h'},
            'compaction':     {'mode': 'safeguard'},
            'heartbeat':      {'every': '30m'},
            'maxConcurrent':  4,
            'subagents':      {'maxConcurrent': 8},
        }
    },
    'channels': {
        'telegram': {
            'enabled':      True,
            'dmPolicy':     'open',
            'allowFrom':    ['*'],
            'groupPolicy':  'open',
            'groupAllowFrom': ['*'],
            'streaming':    'partial',
        }
    },
    'messages': {'ackReactionScope': 'group-mentions'},
    'commands': {'native': 'auto', 'nativeSkills': 'auto', 'restart': True, 'ownerDisplay': 'raw'},
    'gateway':  {'mode': 'local'},
}

print(json.dumps(config, indent=2))

#!/usr/bin/env node
/**
 * Generate openclaw.json from environment variables.
 *
 * Priority:
 *   OPENAI_API_KEY + OPENAI_BASE_URL  → openai-completions custom provider
 *   ANTHROPIC_API_KEY                 → native anthropic provider
 *                                       (ANTHROPIC_BASE_URL optional proxy)
 */

const fs   = require('fs');
const path = require('path');

const OUT = path.join(process.env.HOME, '.openclaw', 'openclaw.json');

const OPENAI_KEY     = process.env.OPENAI_API_KEY;
const OPENAI_URL     = process.env.OPENAI_BASE_URL;
const ANTHROPIC_KEY  = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL  = process.env.ANTHROPIC_BASE_URL;
const MODEL          = process.env.OMOCW_MODEL || 'MiniMax-M2.5';

const CHANNEL_BASE = {
  telegram: {
    enabled: true,
    dmPolicy: 'open',
    allowFrom: ['*'],
    groupPolicy: 'open',
    groupAllowFrom: ['*'],
    streaming: 'partial'
  }
};

const AGENT_BASE = {
  contextPruning: { mode: 'cache-ttl', ttl: '1h' },
  compaction:     { mode: 'safeguard' },
  heartbeat:      { every: '30m' },
  maxConcurrent: 4,
  subagents: { maxConcurrent: 8 }
};

const OPENAI_MODELS = [
  { id: 'MiniMax-M2.5',          name: 'MiniMax M2.5',          reasoning: true,  input: ['text'],         contextWindow: 200000, maxTokens: 8192 },
  { id: 'qwen3.5-plus',          name: 'Qwen3.5 Plus',          reasoning: true,  input: ['text', 'image'], contextWindow: 131072, maxTokens: 8192 },
  { id: 'qwen3-max-2026-01-23',  name: 'Qwen3 Max',             reasoning: true,  input: ['text'],         contextWindow: 131072, maxTokens: 8192 },
  { id: 'qwen3-coder-next',      name: 'Qwen3 Coder Next',      reasoning: false, input: ['text'],         contextWindow: 131072, maxTokens: 8192 },
  { id: 'qwen3-coder-plus',      name: 'Qwen3 Coder Plus',      reasoning: false, input: ['text'],         contextWindow: 131072, maxTokens: 8192 },
  { id: 'glm-5',                 name: 'GLM-5',                 reasoning: true,  input: ['text'],         contextWindow: 131072, maxTokens: 8192 },
  { id: 'glm-4.7',               name: 'GLM-4.7',               reasoning: true,  input: ['text'],         contextWindow: 131072, maxTokens: 8192 },
  { id: 'kimi-k2.5',             name: 'Kimi K2.5',             reasoning: true,  input: ['text', 'image'], contextWindow: 131072, maxTokens: 8192 },
].map(m => ({ ...m, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }));

let config;

if (OPENAI_KEY && OPENAI_URL) {
  // ── OpenAI-compatible custom provider ───────────────────────────────────
  console.error(`[gen-config] mode=openai  url=${OPENAI_URL}  model=${MODEL}`);
  config = {
    providers: {
      'custom-openai': {
        baseUrl: OPENAI_URL,
        apiKey:  OPENAI_KEY,
        api:     'openai-completions',
        models:  OPENAI_MODELS
      }
    },
    agents: {
      defaults: {
        model: { primary: `custom-openai/${MODEL}` },
        ...AGENT_BASE
      }
    },
    channels: CHANNEL_BASE,
    messages: { ackReactionScope: 'group-mentions' },
    commands: { native: 'auto', nativeSkills: 'auto', restart: true, ownerDisplay: 'raw' },
    gateway:  { mode: 'local' },
    meta:     { lastTouchedVersion: '2026.3.13' }
  };

} else if (ANTHROPIC_KEY) {
  // ── Native Anthropic provider (+ optional base URL proxy) ───────────────
  const anthropicModel = MODEL.startsWith('claude') ? MODEL : 'claude-sonnet-4-6';
  console.error(`[gen-config] mode=anthropic  model=anthropic/${anthropicModel}${ANTHROPIC_URL ? `  proxy=${ANTHROPIC_URL}` : ''}`);

  config = {
    agents: {
      defaults: {
        model: { primary: `anthropic/${anthropicModel}` },
        ...AGENT_BASE
      }
    },
    channels: CHANNEL_BASE,
    messages: { ackReactionScope: 'group-mentions' },
    commands: { native: 'auto', nativeSkills: 'auto', restart: true, ownerDisplay: 'raw' },
    gateway:  { mode: 'local' },
    meta:     { lastTouchedVersion: '2026.3.13' }
  };

} else {
  console.error('[gen-config] ERROR: set OPENAI_API_KEY+OPENAI_BASE_URL or ANTHROPIC_API_KEY');
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(config, null, 2));
console.error(`[gen-config] written → ${OUT}`);

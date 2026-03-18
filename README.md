# oh-my-openclaw

Curated [ClawHub](https://clawhub.ai) skills for [OpenClaw](https://openclaw.ai), tested via GitHub Actions + Telegram.

## Install

**As OpenClaw plugin (recommended):**
```bash
openclaw plugins install @m4d3bug/oh-my-openclaw
```

**Or one-line script:**
```bash
curl -fsSL https://raw.githubusercontent.com/m4d3bug/oh-my-openclaw/master/install.sh | bash
```

## Included skills (44)

### Security

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [skill-vetter](https://clawhub.ai/spclaudehome/skill-vetter) | 1.0.0 | 2,000 | ✅ Benign | Security-first vetting — review any skill before install |
| [agent-sentinel](https://clawhub.ai/skills/agent-sentinel) | 0.1.1 | 3 | ✅ Benign | Safety circuit breaker — budget constraints, rate limits |
| [arc-skill-scanner](https://clawskills.sh/skills/trypto1019-arc-skill-scanner) | 1.4.0 | 0 | ✅ Benign | Auto-scan skills for vulnerabilities before install |

### Memory & Persistence

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [self-improving-agent](https://clawhub.ai/pskoett/self-improving-agent) | 3.0.4 | 3,700 | ✅ Benign | Log errors, corrections, and learnings across sessions |
| [agent-memory](https://clawhub.ai/skills/agent-memory) | 1.0.0 | 262 | ✅ Benign | Persistent SQLite memory — store, recall, track entities |
| [ontology](https://clawhub.ai/oswalpalash/ontology) | 1.0.4 | 388 | ✅ Benign | Typed knowledge graph for structured agent memory |
| [arc-wake-state](https://clawskills.sh/skills/trypto1019-arc-wake-state) | 1.0.0 | 0 | ✅ Benign | Auto-recover agent state after crash/restart |
| [agent-wal](https://clawskills.sh/skills/bowen31337-agent-wal) | 1.0.1 | 5 | ✅ Benign | Write-Ahead Log — atomic state change guarantees |

### Agent Behavior

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [proactivity](https://clawhub.ai/ivangdavila/proactivity) | 1.0.1 | 18 | ✅ Benign | Anticipate needs, keep work moving, improve over time |
| [self-reflection](https://clawhub.ai/hopyky/self-reflection) | 1.1.1 | 106 | ✅ Benign | Continuous self-improvement through structured reflection |
| [agent-team-orchestration](https://clawhub.ai/arminnaimi/agent-team-orchestration) | 1.0.0 | 125 | ✅ Benign | Multi-agent team coordination — roles, handoffs, reviews |
| [reflection](https://clawhub.ai/ivangdavila/reflection) | 1.1.0 | 23 | ✅ Benign | Self-critique before responding — fewer revision rounds |

### Session Management

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [smart-context](https://clawskills.sh/skills/joe3112-smart-context) | 1.0.0 | 0 | ✅ Benign | Token-efficient context pruning, response sizing, delegation |
| [summarize](https://clawhub.ai/steipete/summarize) | 1.0.0 | 3,800 | ✅ Benign | Summarize conversations, code changes, and sessions |
| [daily-digest](https://clawhub.ai/pmaeter/daily-digest) | 1.0.0 | 68 | ✅ Benign | Generate daily journal from memory files |

### Code Intelligence

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [github](https://clawhub.ai/steipete/github) | 1.0.0 | 2,863 | ✅ Benign | Git workflow — PRs, issues, CI runs via `gh` CLI |
| [test-runner](https://clawhub.ai/cmanfre7/test-runner) | 1.0.0 | 71 | ✅ Benign | Run tests — Jest, pytest, Playwright, XCTest |
| [planning-with-files](https://clawhub.ai/OthmanAdi/planning-with-files) | 2.22.0 | 70 | ⚠️ Suspicious | Task planning — task_plan.md / findings.md / progress.md |
| [docsync](https://clawskills.sh/skills/suhteevah-docsync) | 1.0.1 | 0 | ✅ Benign | Auto-generate docs from code, detect doc drift |
| [simplify-and-harden](https://clawhub.ai/pskoett/simplify-and-harden) | 1.0.1 | 6 | ✅ Benign | Post-completion self-review — simplify, harden, micro-doc |
| [env-setup](https://clawhub.ai/Fratua/env-setup) | 1.0.0 | 2 | ✅ Benign | Scan env vars, generate .env.example, validate .gitignore |

### DevOps

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [cron-mastery](https://clawhub.ai/i-mw/cron-mastery) | 1.0.3 | 103 | ✅ Benign | Cron scheduling and system maintenance |
| [docker-essentials](https://clawhub.ai/Arnarsson/docker-essentials) | 1.0.0 | 209 | ✅ Benign | Docker commands, container management, debugging |
| [cicd-pipeline](https://clawskills.sh/skills/gitgoodordietrying-cicd-pipeline) | 1.0.0 | 24 | ✅ Benign | Manage GitHub Actions CI/CD pipelines directly |

### Context & Search

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [multi-search-engine](https://clawhub.ai/gpyAngyoujun/multi-search-engine) | 2.0.1 | 796 | ✅ Benign | 17 search engines (8 CN + 9 Global), no API key needed |
| [agent-reach](https://clawhub.ai/Panniantong/agent-reach) | 1.1.0 | 246 | ⚠️ Suspicious | Read 14+ platforms (Twitter, Reddit, YouTube, Bilibili, etc.) |
| [agent-browser](https://clawhub.ai/TheSethRose/agent-browser) | 0.2.0 | 2,588 | ✅ Benign | Headless browser — navigate, click, type, screenshot, record |
| [cli-anything](https://github.com/HKUDS/CLI-Anything) | 2026-03-17 | — | GitHub | Natural language to CLI commands for any tool |
| [clawddocs](https://clawskills.sh/skills/nicholasspisak-clawddocs) | 1.2.2 | 413 | ✅ Benign | OpenClaw documentation assistant with decision tree routing |
| [humanizer](https://clawhub.ai/biostartechnology/humanizer) | 1.0.0 | 760 | ✅ Benign | Remove AI writing patterns — make text sound human |

### Creative & Planning

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [brainstorming](https://clawhub.ai/zlc000190/brainstorming) | 0.1.0 | 88 | ✅ Benign | Explore intent, requirements and design before implementation |
| [writing-plans](https://clawhub.ai/zlc000190/writing-plans) | 0.1.0 | 43 | ✅ Benign | Generate multi-step implementation plans from specs |
| [copywriting](https://clawhub.ai/JK-0001/copywriting) | 0.1.0 | 124 | ✅ Benign | Marketing copy — AIDA/PAS/FAB, headlines, CTAs, ad copy |
| [content-strategy](https://clawhub.ai/JK-0001/content-strategy) | 0.1.0 | 45 | ✅ Benign | Content marketing strategy, calendar, distribution, metrics |

### Autonomous Execution

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [better-ralph](https://clawskills.sh/skills/runeweaverstudios-better-ralph) | 1.0.0 | — | ✅ Benign | PRD-driven autonomous coding iteration |
| [agent-weave](https://clawskills.sh/skills/gl813788-byte-agent-weave) | 1.0.0 | — | ✅ Benign | Master-Worker parallel task execution cluster |
| [forge](https://clawskills.sh/skills/ikennaokpala-forge) | 1.0.0 | — | ✅ Benign | Autonomous QA swarm — E2E testing, self-healing fix loops |
| [agent-autonomy-kit](https://clawhub.ai/ryancampbell/agent-autonomy-kit) | 1.0.0 | 121 | ✅ Benign | Stop waiting for prompts — keep working autonomously |
| [codebase-documenter](https://clawhub.ai/Veeramanikandanr48/codebase-documenter) | 0.1.0 | 5 | ✅ Benign | Generate README, architecture docs, API docs from codebase |
| [debug-pro](https://clawhub.ai/cmanfre7/debug-pro) | 1.0.0 | 114 | ✅ Benign | 7-step debugging protocol with multi-language support |

> skill-vetter is installed first to audit all subsequent installs.

## Local setup

### 1. Install OpenClaw + plugin

```bash
npm install -g openclaw
openclaw plugins install @m4d3bug/oh-my-openclaw
```

### 2. Configure model + Telegram

Pick **one** model backend:

**OpenAI-compatible** (e.g. Aliyun DashScope):
```bash
openclaw config set models.providers.custom-openai.baseUrl "https://coding.dashscope.aliyuncs.com/v1"
openclaw config set models.providers.custom-openai.apiKey "your-key"
openclaw config set models.providers.custom-openai.api "openai-completions"
openclaw config set agents.defaults.model.primary "custom-openai/MiniMax-M2.5"
```

**Anthropic-compatible** (e.g. SiliconFlow):
```bash
openclaw config set models.providers.custom-anthropic.baseUrl "https://api.siliconflow.cn/v1"
openclaw config set models.providers.custom-anthropic.apiKey "your-key"
openclaw config set models.providers.custom-anthropic.api "anthropic-messages"
openclaw config set agents.defaults.model.primary "custom-anthropic/Pro/MiniMaxAI/MiniMax-M2.5"
```

**Telegram** (get token from [@BotFather](https://t.me/BotFather)):
```bash
openclaw config set channels.telegram.enabled true
openclaw config set channels.telegram.dmPolicy open
openclaw config set channels.telegram.allowFrom '["*"]'   # skip pairing, anyone can chat
# or restrict to your Telegram ID only:
# openclaw config set channels.telegram.allowFrom '["YOUR_TELEGRAM_ID"]'
```

> Both local and GitHub Actions use `dmPolicy: open` + `allowFrom: ["*"]` to skip device pairing. Change `["*"]` to your Telegram user ID for production use.

### 3. Enable full tools + start

```bash
openclaw config set tools.profile full
TELEGRAM_BOT_TOKEN="your-bot-token" openclaw gateway run --verbose
```

Chat with your bot on Telegram. Skills are loaded automatically from the plugin.

---

## GitHub Actions + Telegram

1. **Fork** this repo
2. **Set Secrets** (Settings > Secrets > Actions):

   | Secret | How to get it |
   |--------|--------------|
   | `TELEGRAM_BOT_TOKEN` | [@BotFather](https://t.me/BotFather) > `/newbot` |

   Pick **one** model backend (or both — OpenAI takes priority):

   **OpenAI-compatible** (e.g. Aliyun DashScope):
   | Secret | Example |
   |--------|---------|
   | `OPENAI_API_KEY` | your key |
   | `OPENAI_BASE_URL` | `https://coding.dashscope.aliyuncs.com/v1` |
   | `OPENAI_MODEL` | `MiniMax-M2.5` |

   **Anthropic-compatible** (e.g. SiliconFlow):
   | Secret | Example |
   |--------|---------|
   | `ANTHROPIC_API_KEY` | your key |
   | `ANTHROPIC_BASE_URL` | `https://api.siliconflow.cn/v1` |
   | `ANTHROPIC_MODEL` | `Pro/MiniMaxAI/MiniMax-M2.5` |

3. **Push** any commit or run workflow manually (Actions > Test Drive > Run workflow)
4. **Chat** with your bot on Telegram

New runs automatically cancel previous ones.

## Default configuration

```
tools.profile = full
```

## Managing skills

```bash
clawhub install <slug>       # Install a skill
clawhub search "keyword"     # Search ClawHub
clawhub list                 # List installed
clawhub update --all         # Update all
```

## How it works

```
Push / Manual trigger
  └─ GitHub Actions
       ├─ docker pull ghcr.io/openclaw/openclaw
       ├─ clawhub install (from skills.txt)
       ├─ git clone (from github-skills.txt)
       ├─ docker run ... bash /omocw/docker/entrypoint.sh
       │    ├─ gen-config.py         → ~/.openclaw/openclaw.json
       │    ├─ copy skills/*/SKILL.md → ~/.openclaw/skills/
       │    ├─ openclaw config set tools.profile full
       │    └─ openclaw gateway run (Telegram polling)
       └─ Keep alive 15 min, then cleanup
```

## License

MIT

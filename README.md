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

## Included skills (42)

### Security

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [skill-vetter](https://clawhub.ai/spclaudehome/skill-vetter) | 1.0.0 | 2,000 | ✅ Benign | Security-first vetting — review any skill before install |
| [anti-injection-skill](https://clawhub.ai/skills/anti-injection-skill) | 1.1.2 | 3 | ⚠️ Suspicious | Block prompt injection, memory tampering, data leakage |
| [agent-sentinel](https://clawhub.ai/skills/agent-sentinel) | 0.1.1 | 3 | ✅ Benign | Safety circuit breaker — budget constraints, rate limits |
| [ggshield-scanner](https://clawskills.sh/skills/amascia-gg-ggshield-scanner) | 1.0.2 | 3 | ⚠️ Suspicious | Detect 500+ types of hardcoded secrets |
| [credential-manager](https://clawskills.sh/skills/callmedas69-credential-manager) | 1.3.0 | 21 | ⚠️ Suspicious | Unified credential management, enforce security baseline |
| [arc-skill-scanner](https://clawskills.sh/skills/trypto1019-arc-skill-scanner) | 1.4.0 | 0 | ✅ Benign | Auto-scan skills for vulnerabilities before install |
| [agentaudit](https://clawskills.sh/skills/starbuck100-agentaudit) | 1.0.0 | 1 | ⚠️ Suspicious | Check vulnerability databases before package install |

### Memory & Persistence

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [self-improving-agent](https://clawhub.ai/pskoett/self-improving-agent) | 3.0.4 | 3,700 | ✅ Benign | Log errors, corrections, and learnings across sessions |
| [agent-memory](https://clawhub.ai/skills/agent-memory) | 1.0.0 | 262 | ✅ Benign | Persistent SQLite memory — store, recall, track entities |
| [ontology](https://clawhub.ai/oswalpalash/ontology) | 1.0.4 | 388 | ✅ Benign | Typed knowledge graph for structured agent memory |
| [fractal-memory](https://clawskills.sh/skills/bugmaker2-fractal-memory) | 1.0.0 | 0 | ⚠️ Suspicious | Hierarchical compression — prevent context overflow |
| [arc-wake-state](https://clawskills.sh/skills/trypto1019-arc-wake-state) | 1.0.0 | 0 | ✅ Benign | Auto-recover agent state after crash/restart |
| [agent-wal](https://clawskills.sh/skills/bowen31337-agent-wal) | 1.0.1 | 5 | ✅ Benign | Write-Ahead Log — atomic state change guarantees |

### Agent Behavior

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [proactivity](https://clawhub.ai/ivangdavila/proactivity) | 1.0.1 | 18 | ✅ Benign | Anticipate needs, keep work moving, improve over time |
| [metacognition](https://clawskills.sh/skills/meimakes-metacognition) | 1.0.0 | 0 | ✅ Benign | Self-reflection engine — extract patterns into knowledge graph |
| [agent-mode-upgrades](https://clawskills.sh/skills/maverick-software-agent-mode-upgrades) | 2.3.1 | 2 | ⚠️ Suspicious | Persistent state + auto-planning + pre-execution approval |
| [debug-methodology](https://clawskills.sh/skills/abczsl520-debug-methodology) | 1.2.0 | 2 | ✅ Benign | Systematic debugging — block patch chains and workarounds |
| [runesleo-systematic-debugging](https://clawhub.ai/runesleo/runesleo-systematic-debugging) | 3.0.0 | 9 | ✅ Benign | Four-phase systematic debugging framework |
| [agent-team-orchestration](https://clawhub.ai/arminnaimi/agent-team-orchestration) | 1.0.0 | 125 | ✅ Benign | Multi-agent team coordination — roles, handoffs, reviews |

### Session Management

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [smart-context](https://clawskills.sh/skills/joe3112-smart-context) | 1.0.0 | 0 | ✅ Benign | Token-efficient context pruning, response sizing, delegation |
| [summarize](https://clawhub.ai/steipete/summarize) | 1.0.0 | — | ✅ Benign | Summarize conversations, code changes, and sessions |
| [daily-digest](https://clawhub.ai/pmaeter/daily-digest) | 1.0.0 | 68 | ✅ Benign | Generate daily journal from memory files |
| [alex-session-wrap-up](https://clawskills.sh/skills/xbillwatsonx-alex-session-wrap-up) | 1.0.0 | 0 | ✅ Benign | Auto-commit + extract learnings + persist rules |
| [buildlog](https://clawskills.sh/skills/espetey-buildlog) | 1.0.1 | 7 | ⚠️ Suspicious | Replayable coding session log for auditing |
| [buffer-session](https://clawskills.sh/skills/waynevaughan-buffer-session) | 1.0.0 | 0 | ✅ Benign | Native session switching with state buffering |

### Code Intelligence

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [github](https://clawhub.ai/steipete/github) | 1.0.0 | 2,863 | ✅ Benign | Git workflow — PRs, issues, CI runs via `gh` CLI |
| [test-runner](https://clawhub.ai/cmanfre7/test-runner) | 1.0.0 | 71 | ✅ Benign | Run tests — Jest, pytest, Playwright, XCTest |
| [planning-with-files](https://clawhub.ai/OthmanAdi/planning-with-files) | 2.22.0 | 70 | ⚠️ Suspicious | Task planning — task_plan.md / findings.md / progress.md |
| [pyright-lsp](https://clawskills.sh/skills/bowen31337-pyright-lsp) | 1.0.0 | 1 | ✅ Benign | Python language server — static type checking |
| [astrai-code-review](https://clawskills.sh/skills/beee003-astrai-code-review) | 1.0.0 | 0 | ⚠️ Suspicious | AI code review + smart model routing, save 40%+ cost |
| [cacheforge-vibe-check](https://clawskills.sh/skills/tkuehnl-cacheforge-vibe-check) | 1.0.0 | 0 | ✅ Benign | Detect AI-generated code quality issues |
| [docsync](https://clawskills.sh/skills/suhteevah-docsync) | 1.0.1 | 0 | ✅ Benign | Auto-generate docs from code, detect doc drift |

### DevOps

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [cron-mastery](https://clawhub.ai/i-mw/cron-mastery) | 1.0.3 | 103 | ✅ Benign | Cron scheduling and system maintenance |
| [agentic-devops](https://clawskills.sh/skills/tkuehnl-agentic-devops) | 1.0.0 | 0 | ✅ Benign | Docker + process management + log analysis + health monitoring |
| [sentry-observability](https://clawskills.sh/skills/sergical-sentry-observability) | 1.1.0 | 0 | ⚠️ Suspicious | Error/log/traces integration with Sentry |
| [arc-metrics-dashboard](https://clawskills.sh/skills/trypto1019-arc-metrics-dashboard) | 1.0.0 | 0 | ✅ Benign | Agent call volume, error rate, latency, cost visualization |
| [cicd-pipeline](https://clawskills.sh/skills/gitgoodordietrying-cicd-pipeline) | 1.0.0 | 24 | ✅ Benign | Manage GitHub Actions CI/CD pipelines directly |

### Context & Search

| Skill | Version | Installs | OpenClaw Scan | What it does |
|-------|---------|----------|---------------|-------------|
| [multi-search-engine](https://clawhub.ai/gpyAngyoujun/multi-search-engine) | 2.0.1 | 796 | ✅ Benign | 17 search engines (8 CN + 9 Global), no API key needed |
| [agent-reach](https://clawhub.ai/Panniantong/agent-reach) | 1.1.0 | 246 | ⚠️ Suspicious | Read 14+ platforms (Twitter, Reddit, YouTube, Bilibili, etc.) |
| [agent-browser](https://clawhub.ai/TheSethRose/agent-browser) | 0.2.0 | — | ✅ Benign | Headless browser — navigate, click, type, screenshot, record |
| [docs-feeder](https://clawskills.sh/skills/zerone0x-docs-feeder) | 1.0.0 | 1 | ⚠️ Suspicious | Auto-fetch project docs and feed to agent |
| [cli-anything](https://github.com/HKUDS/CLI-Anything) | — | — | GitHub | Natural language to CLI commands for any tool |

> skill-vetter is installed first to audit all subsequent installs.

## Try it — GitHub Actions + Telegram

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

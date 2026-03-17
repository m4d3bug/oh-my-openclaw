# oh-my-openclaw

Curated [ClawHub](https://clawhub.ai) skills for [OpenClaw](https://openclaw.ai), tested via GitHub Actions + Telegram.

## One-line install

```bash
curl -fsSL https://raw.githubusercontent.com/m4d3bug/oh-my-openclaw/master/install.sh | bash
```

## Included skills

| # | Skill | Version | Current Installs | OpenClaw Scan | What it does |
|---|-------|---------|-----------------|---------------|-------------|
| 1 | [skill-vetter](https://clawhub.ai/spclaudehome/skill-vetter) | 1.0.0 | 2,000 | ✅ Benign | Security-first vetting — review any skill before install |
| 2 | [self-improving-agent](https://clawhub.ai/pskoett/self-improving-agent) | 3.0.4 | 3,700 | ✅ Benign | Logs errors, corrections, and learnings across sessions |
| 3 | [github](https://clawhub.ai/steipete/github) | 1.0.0 | 2,863 | ✅ Benign | Git workflow — PRs, issues, CI runs via `gh` CLI |
| 4 | [multi-search-engine](https://clawhub.ai/gpyAngyoujun/multi-search-engine) | 2.0.1 | 796 | ✅ Benign | 17 search engines (8 CN + 9 Global), no API key needed |
| 5 | [ontology](https://clawhub.ai/oswalpalash/ontology) | 1.0.4 | 388 | ✅ Benign | Typed knowledge graph for structured agent memory |
| 6 | [agent-reach](https://clawhub.ai/Panniantong/agent-reach) | 1.1.0 | 246 | ⚠️ Suspicious | Read 14+ platforms (Twitter, Reddit, YouTube, Bilibili, etc.) |
| 7 | [agent-browser](https://clawhub.ai/TheSethRose/agent-browser) | 0.2.0 | — | ✅ Benign | Headless browser — navigate, click, type, screenshot, record |
| 8 | [planning-with-files](https://clawhub.ai/OthmanAdi/planning-with-files) | 2.22.0 | 70 | ⚠️ Suspicious | Task planning — task_plan.md / findings.md / progress.md |
| 9 | [test-runner](https://clawhub.ai/cmanfre7/test-runner) | 1.0.0 | 71 | ✅ Benign | Run tests — Jest, pytest, Playwright, XCTest |
| 10 | [cron-scheduler](https://clawhub.ai/picaye/cron-scheduler) | 1.0.0 | — | ✅ Benign | Schedule and manage recurring tasks with cron |
| 11 | [summarize](https://clawhub.ai/steipete/summarize) | 1.0.0 | — | ✅ Benign | Summarize conversations, code changes, and sessions |
| 12 | [daily-digest](https://clawhub.ai/pmaeter/daily-digest) | 1.0.0 | 68 | ✅ Benign | Generate daily journal from memory files |
| 13 | [proactivity](https://clawhub.ai/ivangdavila/proactivity) | 1.0.1 | 18 | ✅ Benign | Anticipate needs, keep work moving, improve over time |
| 14 | [cli-anything](https://github.com/HKUDS/CLI-Anything) | — | — | GitHub | Natural language to CLI commands for any tool |

> Skills are **not** stored in this repo. They are installed from ClawHub/GitHub at container startup via `skills.txt` and `github-skills.txt`.
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

The container starts with:

```
tools.profile = full
```

This enables all OpenClaw tools (web fetch, file operations, shell, etc.) for maximum skill compatibility.

## Managing skills

```bash
# Install a skill
clawhub install <slug>

# Search ClawHub
clawhub search "keyword"

# List installed
clawhub list

# Update all
clawhub update --all
```

Skills are tracked in `.clawhub/lock.json` and stored in `skills/`.

## How it works

```
Push / Manual trigger
  └─ GitHub Actions
       ├─ docker pull ghcr.io/openclaw/openclaw
       ├─ docker run ... bash /omocw/docker/entrypoint.sh
       │    ├─ gen-config.py       → ~/.openclaw/openclaw.json
       │    ├─ fetch-sources.py    → agents + .js skills
       │    ├─ copy SKILL.md dirs  → ~/.openclaw/skills/
       │    ├─ openclaw config set tools.profile full
       │    └─ openclaw gateway run (Telegram polling)
       └─ Keep alive 5–25 min, then cleanup
```

## License

MIT

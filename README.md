# oh-my-openclaw

Curated [ClawHub](https://clawhub.ai) skills for [OpenClaw](https://openclaw.ai), tested via GitHub Actions + Telegram.

## One-line install

```bash
curl -fsSL https://raw.githubusercontent.com/m4d3bug/oh-my-openclaw/master/install.sh | bash
```

## Included skills

| Skill | Version | What it does |
|-------|---------|-------------|
| [self-improving-agent](https://clawhub.ai/pskoett/self-improving-agent) | 3.0.4 | Logs errors, corrections, and learnings for continuous improvement across sessions |
| [agent-reach](https://clawhub.ai/Panniantong/agent-reach) | 1.1.0 | Search and read 14+ platforms (Twitter, Reddit, YouTube, GitHub, Bilibili, etc.) |
| [summarize](https://clawhub.ai/steipete/summarize) | 1.0.0 | Summarize conversations, code changes, and sessions |
| [agent-browser](https://clawhub.ai/TheSethRose/agent-browser) | 0.2.0 | Headless browser automation — navigate, click, type, screenshot, record |

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

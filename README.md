# oh-my-openclaw

Claude Code level experience for [OpenClaw](https://github.com/openclaw/openclaw) — running entirely inside Docker, host installation untouched.

---

## Try it in 3 minutes — no local install needed

Fork this repo, set Secrets, push any commit, and chat on Telegram.

### Step 1 — Fork

Click **Fork** on this repo.

### Step 2 — Set GitHub Secrets

Go to your fork → **Settings → Secrets and variables → Actions → New repository secret**

Pick **one** model backend (or both — OpenAI takes priority if both are set):

**Option A — OpenAI-compatible** (e.g. Aliyun DashScope):

| Secret | Example value |
|---|---|
| `OPENAI_API_KEY` | your API key |
| `OPENAI_BASE_URL` | `https://coding.dashscope.aliyuncs.com/v1` |
| `OPENAI_MODEL` | `MiniMax-M2.5` (default) |

**Option B — Anthropic-compatible** (e.g. SiliconFlow):

| Secret | Example value |
|---|---|
| `ANTHROPIC_API_KEY` | your API key |
| `ANTHROPIC_BASE_URL` | `https://api.siliconflow.cn/v1` |
| `ANTHROPIC_MODEL` | `Pro/MiniMaxAI/MiniMax-M2.5` (default) |

**Always required:**

| Secret | How to get it |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Message [@BotFather](https://t.me/BotFather) → `/newbot` |

> Secrets are never printed in logs.

### Step 3 — Trigger the workflow

Push any commit (or go to **Actions → Test Drive — Telegram → Run workflow**).

For manual runs you can choose a duration: 5 / 10 / 15 / 20 / 25 minutes.

Every push auto-triggers a 5-minute test run.

### Step 4 — Chat on Telegram

Send any message to your bot. The agent responds using the model you configured.

The bot shuts down automatically when the workflow finishes.

---

## How it works

```
GitHub Actions
  └── docker run ghcr.io/openclaw/openclaw
        ├── docker/gen-config.py   → ~/.openclaw/openclaw.json
        ├── openclaw setup         → workspace init
        └── openclaw gateway run   → Telegram polling (TELEGRAM_BOT_TOKEN)
```

- No Docker build step — uses the official `ghcr.io/openclaw/openclaw` image directly
- Config is generated at runtime from environment variables
- Telegram polling mode — no webhook, no server needed
- `dmPolicy: open` + `allowFrom: ["*"]` — no pairing required in CI

### Supported models (OpenAI provider)

| Model ID | Name | Reasoning |
|---|---|---|
| `MiniMax-M2.5` | MiniMax M2.5 | yes |
| `qwen3.5-plus` | Qwen3.5 Plus | yes |
| `qwen3-max-2026-01-23` | Qwen3 Max | yes |
| `qwen3-coder-next` | Qwen3 Coder Next | no |
| `qwen3-coder-plus` | Qwen3 Coder Plus | no |
| `glm-5` | GLM-5 | yes |
| `glm-4.7` | GLM-4.7 | yes |
| `kimi-k2.5` | Kimi K2.5 | yes |

### Supported models (Anthropic provider)

| Model ID | Name |
|---|---|
| `Pro/MiniMaxAI/MiniMax-M2.5` | MiniMax M2.5 (SiliconFlow) |
| `Pro/Qwen/Qwen3-235B-A22B` | Qwen3 235B (SiliconFlow) |
| `Pro/THUDM/GLM-4-32B` | GLM-4 32B (SiliconFlow) |
| `Pro/moonshotai/Kimi-K2-Instruct` | Kimi K2 (SiliconFlow) |

---

## Agent prompts

The `agents/` directory contains 10 role-specific system prompt definitions:

| File | Role |
|---|---|
| `architect.md` | System design, ADRs, component diagrams |
| `backend.md` | APIs, databases, server-side logic |
| `frontend.md` | UI, components, accessibility |
| `devops.md` | Docker, CI/CD, infrastructure |
| `researcher.md` | Tech evaluation, documentation synthesis |
| `reviewer.md` | Code review, quality assurance |
| `tester.md` | Test strategy, unit/integration/e2e tests |
| `product.md` | PRDs, user stories, prioritization |
| `security.md` | Threat modeling, vulnerability assessment |
| `data.md` | Pipelines, analytics, ML ops |

These are prompt files. Paste the contents into your conversation to switch the agent's persona, or reference them when building custom openclaw agent routing.

---

## Security

Skills are scanned by [`@goplus/agentguard`](https://github.com/GoPlusSecurity/agentguard) at runtime via `.openclaw/skills/oh-my-openclaw.js`.

---

## Repository structure

```
oh-my-openclaw/
├── .github/workflows/
│   └── test-drive.yml          # Auto-runs on every push; manual: 5–25 min
├── docker/
│   ├── bootstrap.sh            # Entry point inside the container
│   ├── gen-config.py           # Generates openclaw.json from env vars
│   └── openclaw.template.json  # Reference config template
├── agents/                     # 10 agent system prompt definitions (.md)
├── skills/                     # Skill extensions (autopilot/team/code/git/notify)
├── config/
│   ├── agents.yml              # Agent roster reference
│   └── openclaw.example.yml    # Config reference
├── .openclaw/skills/
│   └── oh-my-openclaw.js       # AgentGuard-validated skill loader
├── package.json                # @goplus/agentguard dependency
└── install.sh                  # Local install helper
```

---

## License

MIT

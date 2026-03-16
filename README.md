# oh-my-openclaw

Claude Code level experience for [OpenClaw](https://github.com/openclaw/openclaw).

Multi-agent orchestration, skill extensions, and a Claude Code-style workflow — all running inside Docker so your host openclaw is never touched.

---

## Try it in 3 minutes — no local install needed

Fork this repo, set two Secrets, run one Action, and chat on Telegram.

### Step 1 — Fork

Click **Fork** on this repo.

### Step 2 — Set GitHub Secrets

Go to your fork → **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Where to get it | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com/keys](https://console.anthropic.com/keys) | Yes |
| `ANTHROPIC_BASE_URL` | Your API proxy / gateway base URL (e.g. `https://your-proxy.example.com/v1`) | Yes |
| `TELEGRAM_BOT_TOKEN` | Message [@BotFather](https://t.me/BotFather) → `/newbot` | Yes |
| `TELEGRAM_CHAT_ID` | See below | Yes |

**How to get your `TELEGRAM_CHAT_ID`** (no pairing command needed):

1. Send any message to your bot (e.g. `/start`)
2. Open in browser: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. Find `result[0].message.chat.id` in the JSON — that number is your chat ID

> **These are Secrets (not Variables)** — GitHub never shows their values in logs.

### Step 3 — (Optional) set Variables

Go to **Settings → Secrets and variables → Actions → Variables tab**

| Variable name | Default | Options |
|---|---|---|
| `OMC_AGENT_MODE` | `team` | `team` / `autopilot` |
| `OMC_MODEL_DEFAULT` | `claude-sonnet-4-6` | any Anthropic model ID |

### Step 4 — Run the workflow

Go to **Actions → Test Drive — Telegram → Run workflow**

Pick a duration (5–25 minutes) and click **Run workflow**.

### Step 5 — Chat on Telegram

Open Telegram and message your bot. Try:

```
/autopilot build a REST API for a todo list
/team create a login system with JWT
/code read src/index.js
/git status
```

The bot shuts down automatically when the workflow finishes.
If you like what you see, run `bash install.sh` locally.

---

## Local install

Requires: Docker, Node ≥ 22

```bash
git clone https://github.com/m4d3bug/oh-my-openclaw
cd oh-my-openclaw
bash install.sh
omc start
```

The installer:
1. Pulls `alpine/openclaw:latest` and `ghcr.io/openclaw/openclaw`
2. Installs `@goplus/agentguard` and other deps
3. Validates all built-in skills through AgentGuard
4. Links the `omc` CLI

**Host openclaw is never touched.**

---

## omc CLI

```
omc setup              Interactive setup wizard
omc validate [opts]    AgentGuard skill validation
omc start [full]       Start container (default: alpine image)
omc update             Pull latest images, re-validate, rebuild
omc agent [name]       Print a built-in agent prompt
```

## Chat commands

| Command | Description |
|---|---|
| `/autopilot <task>` | Autonomous multi-step task execution |
| `/team <task>` | Parallel multi-agent team mode |
| `/code read <file>` | Read a file |
| `/code edit <file> "<instruction>"` | AI-powered file edit |
| `/code new <file> "<description>"` | Create a new file |
| `/code run <command>` | Run a shell command |
| `/git status` | Git status |
| `/git diff` | Git diff |
| `/git commit "<msg>"` | Commit all changes |
| `/git pr <title>` | Create a GitHub PR |
| `/notify <msg>` | Send cross-channel notification |

## Agents

| Agent | Role |
|---|---|
| `architect` | System design, ADRs, component diagrams |
| `backend` | APIs, databases, server-side logic |
| `frontend` | UI, components, accessibility |
| `devops` | Docker, CI/CD, infrastructure |
| `researcher` | Tech evaluation, documentation synthesis |
| `reviewer` | Code review, quality assurance |
| `tester` | Test strategy, unit/integration/e2e tests |
| `product` | PRDs, user stories, prioritization |
| `security` | Threat modeling, vulnerability assessment |
| `data` | Pipelines, analytics, ML ops |

## Security

Every skill is scanned by [`@goplus/agentguard`](https://github.com/GoPlusSecurity/agentguard) at:

- **Build time** — baked into the Docker image
- **Install time** — during `bash install.sh`
- **Runtime** — on skill load via `.openclaw/skills/oh-my-openclaw.js`
- **On-demand** — `omc validate --dir ./my-skills --strict`

## Architecture

```
oh-my-openclaw/
├── .github/workflows/
│   └── test-drive.yml      # GitHub Actions test (no local install needed)
├── install.sh
├── scripts/
│   ├── omc.js              # CLI entry point
│   ├── validate.js         # AgentGuard runner
│   └── setup.js            # Interactive setup wizard
├── docker/
│   ├── Dockerfile          # ghcr.io/openclaw/openclaw based
│   ├── Dockerfile.alpine   # alpine/openclaw:latest based (CI default)
│   ├── docker-compose.yml
│   └── entrypoint.sh
├── agents/                 # 10 agent prompt definitions
├── skills/                 # autopilot / team / code / git / notify
├── config/
│   ├── openclaw.example.yml
│   └── agents.yml
└── .openclaw/skills/       # openclaw skill registration entry point
```

## License

MIT

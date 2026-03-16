# oh-my-openclaw

Claude Code level experience for [OpenClaw](https://github.com/openclaw/openclaw).

Multi-agent orchestration, skill extensions, and a Claude Code-style workflow — all running inside Docker so your host openclaw is never touched.

## Features

- **10 specialized agents** — architect, backend, frontend, devops, researcher, reviewer, tester, product, security, data
- **Team mode** — parallel multi-agent execution with synthesis (`/team`)
- **Autopilot** — autonomous task decomposition and execution (`/autopilot`)
- **Code editing** — Claude Code-style file read/edit/create from chat (`/code`)
- **Git operations** — status, diff, commit, PR from chat (`/git`)
- **AgentGuard** — every skill is scanned by [@goplus/agentguard](https://github.com/GoPlusSecurity/agentguard) before activation
- **Docker isolated** — runs on `alpine/openclaw:latest` or `ghcr.io/openclaw/openclaw`, never modifies host

## Quick start

```bash
git clone https://github.com/your-org/oh-my-openclaw
cd oh-my-openclaw
bash install.sh
omc start
```

Or with Docker Compose directly:

```bash
docker compose -f docker/docker-compose.yml --profile alpine up --build
```

## Validate custom skills

Before adding any skill, run it through AgentGuard:

```bash
omc validate --dir ./my-skills --strict
```

Or via Docker:

```bash
SKILLS_DIR=./my-skills docker compose -f docker/docker-compose.yml --profile validate up
```

## omc CLI

```
omc setup              Interactive setup wizard
omc validate [opts]    AgentGuard skill validation
omc start [full]       Start openclaw container (default: alpine)
omc update             Pull latest images, re-validate, rebuild
omc agent [name]       Print a built-in agent prompt
```

## Chat commands

| Command | Description |
|---------|-------------|
| `/autopilot <task>` | Autonomous task execution |
| `/team <task>` | Parallel multi-agent team |
| `/code read <file>` | Read a file |
| `/code edit <file> "<instruction>"` | Edit a file |
| `/code new <file> "<description>"` | Create a file |
| `/code run <command>` | Run a shell command |
| `/git status` | Git status |
| `/git diff` | Git diff |
| `/git commit "<msg>"` | Commit all changes |
| `/git pr <title>` | Create a GitHub PR |
| `/notify <msg>` | Send cross-channel notification |

## Architecture

```
oh-my-openclaw/
├── install.sh              # One-shot installer
├── scripts/
│   ├── omc.js              # CLI entry point
│   ├── validate.js         # AgentGuard runner
│   └── setup.js            # Interactive setup wizard
├── docker/
│   ├── Dockerfile          # ghcr.io/openclaw/openclaw based
│   ├── Dockerfile.alpine   # alpine/openclaw:latest based
│   ├── docker-compose.yml
│   └── entrypoint.sh
├── agents/                 # Agent prompt definitions
├── skills/                 # Skill implementations
├── config/                 # openclaw config templates
└── .openclaw/skills/       # openclaw skill entry point
```

## Security

All skills are scanned by `@goplus/agentguard` at:
- Build time (inside Docker image)
- Install time (`install.sh`)
- Runtime (on skill load via `.openclaw/skills/oh-my-openclaw.js`)
- On-demand (`omc validate`)

## License

MIT

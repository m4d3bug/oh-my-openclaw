# oh-my-openclaw

> Automatically test and iterate OpenCLAW skills via GitHub Actions with best practices.

## Features

- **GitHub Actions Testing**: Automatically test skills on push/PR
- **One-command Install**: Install skills from remote URLs (like wechat-to-obsidian)
- **AgentGuard Validation**: All skills validated with @goplus/agentguard
- **Best Practices**: Provide OpenCLAW configuration patterns

## Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/m4d3bug/oh-my-openclaw.git
cd oh-my-openclaw
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Required secrets (for GitHub Actions):
- `TELEGRAM_BOT_TOKEN` - from @BotFather
- `ANTHROPIC_API_KEY` - or OpenAI compatible
- `ANTHROPIC_BASE_URL` - e.g., https://api.siliconflow.cn/v1

### 3. Start Testing

```bash
# Validate all skills
omc validate --all --strict

# Test skills in Docker
omc test

# Or use GitHub Actions
# Fork this repo → add secrets → run workflow
```

## Installing Skills

### One-command Install

Install skills from a remote install.md URL:

```bash
omc install https://raw.githubusercontent.com/m4d3bug/wechat-to-obsidian/main/install.md
```

This will:
1. Fetch the install.md from the URL
2. Parse and execute installation steps
3. Validate with AgentGuard
4. Save to skills directory

### Manual Installation

```bash
# Create skill directory
mkdir skills/my-skill

# Add skill files
echo 'export default { name: "my-skill", ... }' > skills/my-skill/index.js

# Validate
omc validate --dir skills/my-skill --strict
```

## Available Commands

| Command | Description |
|---------|-------------|
| `omc setup` | Interactive setup wizard |
| `omc validate` | Run AgentGuard on skills |
| `omc start` | Start OpenCLAW container |
| `omc install <url>` | Install skill from URL |
| `omc test [skill]` | Test skill in Docker |
| `omc agent <name>` | Show agent prompt |

## GitHub Actions Workflows

### test-drive.yml
Tests the entire environment with Telegram integration. Sets up:
- Telegram bot with your token
- OpenAI or Anthropic compatible API
- Runs for configurable duration

### skill-test.yml
Automatically validates skills on:
- Push to `skills/` directory
- Pull requests
- Manual workflow dispatch

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | For test-drive |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | For test-drive |
| `ANTHROPIC_API_KEY` | Anthropic API key | For testing |
| `ANTHROPIC_BASE_URL` | Anthropic-compatible API URL | For testing |
| `ANTHROPIC_MODEL` | Model name (e.g., Pro/MiniMax-M2.5) | For testing |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `OPENAI_BASE_URL` | OpenAI-compatible API URL | Optional |
| `OPENAI_MODEL` | Model name | Optional |

## Project Structure

```
oh-my-openclaw/
├── .github/workflows/   # GitHub Actions workflows
│   ├── test-drive.yml  # Full environment test
│   └── skill-test.yml  # Skill validation
├── agents/              # Agent prompts
├── config/              # Configuration files
├── docker/              # Docker files
├── scripts/             # CLI scripts
│   ├── validate.js     # AgentGuard validation
│   ├── install-skill.js # Remote skill installer
│   └── omc.js          # CLI entry point
├── skills/              # Skill modules
└── package.json
```

## Best Practices

### Skill Development

1. **Always validate** with AgentGuard before submitting
2. **Use ES modules** (`export default`)
3. **Follow naming**: `skills/<skill-name>/index.js`
4. **Include metadata**: name, version, description

### Configuration

See `config/openclaw.example.yml` for recommended settings.

## License

MIT
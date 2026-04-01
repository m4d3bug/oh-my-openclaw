#!/usr/bin/env node
/**
 * omocw — oh-my-openclaw CLI entry point
 *
 * Subcommands:
 *   omocw setup              interactive setup wizard
 *   omocw validate           run AgentGuard on all / custom skills
 *   omocw start [alpine]     start openclaw container
 *   omocw update             pull new images + re-validate
 *   omocw install <slug>     install a skill via clawhub
 *   omocw search <query>     search clawhub skills
 *   omocw test [opts]        test config with alpine/openclaw:latest
 *   omocw agent <name>       print a built-in agent prompt
 */

import { spawnSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { resolve, join, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const [,, cmd, ...rest] = process.argv;

function run(cmd) {
  const r = spawnSync(cmd, { shell: true, stdio: 'inherit' });
  process.exit(r.status ?? 0);
}

switch (cmd) {
  case 'setup':
    run(`node ${ROOT}/scripts/setup.js`);
    break;

  case 'validate':
    run(`node ${ROOT}/scripts/validate.js ${rest.join(' ')}`);
    break;

  case 'start': {
    const profile = rest[0] === 'full' ? 'full' : 'alpine';
    run(`docker compose -f ${ROOT}/docker/docker-compose.yml --profile ${profile} up --build`);
    break;
  }

  case 'update':
    run(`bash ${ROOT}/scripts/update.sh`);
    break;

  case 'install': {
    const slug = rest[0];
    if (!slug) {
      console.error('Usage: omocw install <slug> [--version <ver>] [--force]');
      process.exit(1);
    }
    run(`clawhub install ${rest.join(' ')} --workdir ${ROOT}`);
    break;
  }

  case 'uninstall': {
    const slug = rest[0];
    if (!slug) {
      console.error('Usage: omocw uninstall <slug>');
      process.exit(1);
    }
    run(`clawhub uninstall ${slug} --workdir ${ROOT}`);
    break;
  }

  case 'search':
    run(`clawhub search ${rest.join(' ')}`);
    break;

  case 'list':
    run(`clawhub list --workdir ${ROOT}`);
    break;

  case 'test':
    run(`bash ${ROOT}/scripts/test-config.sh ${rest.join(' ')}`);
    break;

  case 'agent': {
    const name = rest[0];
    if (!name) {
      const agents = readdirSync(resolve(ROOT, 'agents'))
        .filter(f => extname(f) === '.md')
        .map(f => basename(f, '.md'));
      console.log('Available agents:', agents.join(', '));
      break;
    }
    const agentFile = resolve(ROOT, 'agents', `${name}.md`);
    try {
      console.log(readFileSync(agentFile, 'utf8'));
    } catch {
      console.error(`[omocw] Agent "${name}" not found.`);
      process.exit(1);
    }
    break;
  }

  default:
    console.log(`
oh-my-openclaw (omocw) — OpenCLAW skill testing & best practices

Usage:
  omocw setup              Interactive setup (pulls images, installs deps, validates)
  omocw validate [opts]    Run AgentGuard on skills
  omocw start [full]       Start openclaw container (default: alpine)
  omocw update             Pull latest images + re-validate + rebuild
  omocw install <slug>     Install a skill from ClawHub
  omocw uninstall <slug>   Uninstall a clawhub skill
  omocw search <query>     Search ClawHub skills
  omocw list               List installed clawhub skills
  omocw test [opts]        Test config with alpine/openclaw:latest
  omocw agent [name]       Show a built-in agent prompt

Options for validate:
  --all                  Validate all built-in skills
  --dir <path>           Validate custom skill directory
  --file <path>          Validate a single file
  --strict               Treat warnings as errors
  --report               Print full JSON report

Options for test:
  --quick                Config generation only (default)
  --with-boot            Full bootstrap test (needs API keys)

Examples:
  omocw install self-improving-agent
  omocw search "code review"
  omocw list
  omocw validate --all --strict
`);
}

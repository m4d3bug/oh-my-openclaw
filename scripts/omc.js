#!/usr/bin/env node
/**
 * omc — oh-my-openclaw CLI entry point
 *
 * Subcommands:
 *   omc setup              interactive setup wizard
 *   omc validate           run AgentGuard on all / custom skills
 *   omc start [alpine]     start openclaw container
 *   omc update             pull new images + re-validate
 *   omc agent <name>      print a built-in agent prompt
 *   omc install <url>     install a skill from URL
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
    const url = rest[0];
    if (!url) {
      console.error('Usage: omc install <install-url> [--force] [--validate]');
      process.exit(1);
    }
    run(`node ${ROOT}/scripts/install-skill.js ${url} ${rest.slice(1).join(' ')}`);
    break;
  }

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
      console.error(`[omc] Agent "${name}" not found.`);
      process.exit(1);
    }
    break;
  }

  case 'test': {
    const skill = rest[0];
    run(`node ${ROOT}/scripts/test-skill.js ${skill || ''}`);
    break;
  }

  default:
    console.log(`
oh-my-openclaw (omc) — OpenCLAW skill testing & best practices

Usage:
  omc setup              Interactive setup (pulls images, installs deps, validates)
  omc validate [opts]    Run AgentGuard on skills
  omc start [full]       Start openclaw container (default: alpine)
  omc update             Pull latest images + re-validate + rebuild
  omc install <url>      Install a skill from URL (e.g., GitHub raw install.md)
  omc test [skill]       Test a skill in Docker (requires ANTHROPIC_API_KEY)
  omc agent [name]       Show a built-in agent prompt

Options for validate:
  --all                  Validate all built-in skills
  --dir <path>           Validate custom skill directory
  --file <path>          Validate a single file
  --strict               Treat warnings as errors
  --report               Print full JSON report

Examples:
  omc install https://raw.githubusercontent.com/m4d3bug/wechat-to-obsidian/main/install.md
  omc test wechat-to-obsidian
  omc validate --all --strict
`);
}
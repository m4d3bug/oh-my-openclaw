#!/usr/bin/env node
/**
 * omocw — oh-my-openclaw CLI entry point
 *
 * Subcommands:
 *   omocw setup              interactive setup wizard
 *   omocw validate           run AgentGuard on all / custom skills
 *   omocw start [alpine]     start openclaw container
 *   omocw update             pull new images + re-validate
 *   omocw install <url>      install a skill from URL
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
    const url = rest[0];
    if (!url) {
      console.error('Usage: omocw install <install-url> [--force] [--validate]');
      process.exit(1);
    }
    run(`node ${ROOT}/scripts/install-skill.js ${url} ${rest.slice(1).join(' ')}`);
    break;
  }

  case 'test':
    run(`bash ${ROOT}/scripts/test-config.sh ${rest.join(' ')}`);
    break;

  case 'subprojects':
  case 'sub': {
    const subCmd = rest[0] || 'list';
    run(`bash ${ROOT}/scripts/subprojects.sh ${subCmd}`);
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
  omocw install <url>      Install a skill from URL (e.g., GitHub raw install.md)
  omocw test [opts]        Test config with alpine/openclaw:latest
  omocw sub [sync|clean|list]  Manage third-party subprojects
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
  omocw install https://raw.githubusercontent.com/m4d3bug/wechat-to-obsidian/main/install.md
  omocw test --quick
  omocw validate --all --strict
`);
}

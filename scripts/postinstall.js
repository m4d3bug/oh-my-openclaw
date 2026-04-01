#!/usr/bin/env node
/**
 * oh-my-openclaw postinstall — fetch skills from ClawHub and GitHub
 *
 * Reads skills.txt and github-skills.txt, downloads all skills
 * into the local skills/ directory so the plugin manifest can reference them.
 *
 * This runs after `npm install` / `openclaw plugins install`.
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = resolve(ROOT, 'skills');

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', timeout: 30000, ...opts }).toString().trim();
  } catch {
    return null;
  }
}

async function installClawHubSkills() {
  const file = resolve(ROOT, 'skills.txt');
  if (!existsSync(file)) return;

  const hasClawhub = run('clawhub --cli-version');
  if (!hasClawhub) {
    console.log('[omocw] clawhub not found, installing...');
    run('npm install -g clawhub');
  }

  const lines = readFileSync(file, 'utf8').split('\n');
  let count = 0;

  for (const raw of lines) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;

    let slug = line;
    let force = '';
    if (line.includes('[force]')) {
      force = '--force';
      slug = line.replace('[force]', '').trim();
    }

    const skillDir = resolve(SKILLS_DIR, slug);
    if (existsSync(resolve(skillDir, 'SKILL.md'))) {
      count++;
      continue; // already installed
    }

    console.log(`[omocw] Installing: ${slug}`);
    run(`clawhub install ${slug} ${force} --workdir ${ROOT} --no-input`);

    if (existsSync(resolve(skillDir, 'SKILL.md'))) {
      count++;
    }
  }
  console.log(`[omocw] ${count} ClawHub skill(s) ready`);
}

async function installGitHubSkills() {
  const file = resolve(ROOT, 'github-skills.txt');
  if (!existsSync(file)) return;

  const lines = readFileSync(file, 'utf8').split('\n');

  for (const raw of lines) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;

    const [repoUrl, skillPath, skillName] = line.split(/\s+/);
    if (!repoUrl || !skillPath || !skillName) continue;

    const skillDir = resolve(SKILLS_DIR, skillName);
    if (existsSync(resolve(skillDir, 'SKILL.md'))) continue;

    console.log(`[omocw] Cloning: ${skillName}`);
    const tmp = `/tmp/omocw-gh-${skillName}-${Date.now()}`;
    run(`git clone --depth 1 ${repoUrl} ${tmp}`);

    const src = resolve(tmp, skillPath);
    if (existsSync(src)) {
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(resolve(skillDir, 'SKILL.md'), readFileSync(src, 'utf8'));
      console.log(`[omocw] OK: ${skillName}`);
    }
    run(`rm -rf ${tmp}`);
  }
}

console.log('[oh-my-openclaw] Fetching skills...');
await installClawHubSkills();
await installGitHubSkills();
console.log('[oh-my-openclaw] Done.');

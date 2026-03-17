/**
 * oh-my-openclaw — OpenClaw plugin entry point
 *
 * On load: copies bundled skills to ~/.openclaw/skills/
 * and agents to ~/.openclaw/agents/ so OpenClaw picks them
 * up from the standard locations.
 *
 * Install: openclaw plugins install @m4d3bug/oh-my-openclaw
 */

import { readdirSync, existsSync, cpSync, mkdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOME = process.env.HOME || process.env.USERPROFILE;
const OC_SKILLS = resolve(HOME, '.openclaw', 'skills');
const OC_AGENTS = resolve(HOME, '.openclaw', 'agents');
const LEARNINGS = resolve(HOME, '.openclaw', 'workspace', '.learnings');

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true, force: true });
}

function syncSkills() {
  const skillsDir = resolve(__dirname, 'skills');
  if (!existsSync(skillsDir)) return 0;

  mkdirSync(OC_SKILLS, { recursive: true });
  let count = 0;

  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const src = resolve(skillsDir, entry.name);
    if (!existsSync(resolve(src, 'SKILL.md'))) continue;
    const dest = resolve(OC_SKILLS, entry.name);
    copyDir(src, dest);
    count++;
  }
  return count;
}

function syncAgents() {
  const agentsDir = resolve(__dirname, 'agents');
  if (!existsSync(agentsDir)) return 0;

  mkdirSync(OC_AGENTS, { recursive: true });
  let count = 0;

  for (const entry of readdirSync(agentsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const src = resolve(agentsDir, entry.name);
    const name = basename(entry.name, '.md');
    const dest = resolve(OC_AGENTS, name, 'agent');
    mkdirSync(dest, { recursive: true });
    cpSync(src, resolve(dest, 'BOOTSTRAP.md'), { force: true });
    count++;
  }
  return count;
}

export default {
  id: 'oh-my-openclaw',
  name: 'oh-my-openclaw',

  register(api) {
    const skills = syncSkills();
    const agents = syncAgents();
    mkdirSync(LEARNINGS, { recursive: true });
    console.log(`[oh-my-openclaw] Synced ${skills} skills → ~/.openclaw/skills/, ${agents} agents → ~/.openclaw/agents/`);
  },
};

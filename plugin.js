/**
 * oh-my-openclaw — OpenClaw plugin entry point
 *
 * On load: copies bundled SKILL.md skills to ~/.openclaw/skills/
 * Mirrors the same logic as docker/entrypoint.sh in GitHub Actions.
 *
 * Install: openclaw plugins install @m4d3bug/oh-my-openclaw
 */

import { readdirSync, existsSync, cpSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOME = process.env.HOME || process.env.USERPROFILE;
const OC_SKILLS = resolve(HOME, '.openclaw', 'skills');
const LEARNINGS = resolve(HOME, '.openclaw', 'workspace', '.learnings');

function syncSkills() {
  const skillsDir = resolve(__dirname, 'skills');
  if (!existsSync(skillsDir)) return 0;

  mkdirSync(OC_SKILLS, { recursive: true });
  let count = 0;

  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const src = resolve(skillsDir, entry.name);
    if (!existsSync(resolve(src, 'SKILL.md'))) continue;
    cpSync(src, resolve(OC_SKILLS, entry.name), { recursive: true, force: true });
    count++;
  }
  return count;
}

export default {
  id: 'oh-my-openclaw',
  name: 'oh-my-openclaw',

  register(api) {
    const skills = syncSkills();
    mkdirSync(LEARNINGS, { recursive: true });
    console.log(`[oh-my-openclaw] Synced ${skills} skills → ~/.openclaw/skills/`);
  },
};

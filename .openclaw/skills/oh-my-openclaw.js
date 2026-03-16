/**
 * oh-my-openclaw — main openclaw skill entry point
 *
 * Loaded by openclaw via OPENCLAW_SKILL_PATH.
 * Registers all omc skills after AgentGuard validation.
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// AgentGuard — validate this skill bundle itself on load
let AgentGuard;
try {
  AgentGuard = require('@goplus/agentguard');
} catch {
  throw new Error('[oh-my-openclaw] @goplus/agentguard must be installed. Run: npm install @goplus/agentguard');
}

const SKILLS_DIR = resolve(__dirname, '../../skills');

async function validateAndLoad() {
  const { readdir, readFile } = await import('fs/promises');
  const { extname } = await import('path');

  const guard = new AgentGuard.Scanner({ rules: 'all' });
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skillFiles = entries
    .filter(e => e.isFile() && ['.js', '.mjs'].includes(extname(e.name)))
    .map(e => resolve(SKILLS_DIR, e.name));

  const skills = [];
  for (const filePath of skillFiles) {
    // Security scan before import
    const source = await readFile(filePath, 'utf8');
    const result = await guard.scan({ source, filePath });
    if (result.errors?.length) {
      throw new Error(`[oh-my-openclaw] AgentGuard blocked skill ${filePath}: ${result.errors[0].message}`);
    }
    const mod = await import(filePath);
    skills.push(mod.default);
  }
  return skills;
}

export async function register(openclaw) {
  const skills = await validateAndLoad();
  for (const skill of skills) {
    openclaw.registerSkill(skill);
    console.log(`[oh-my-openclaw] Registered skill: ${skill.name}`);
  }
  console.log(`[oh-my-openclaw] ${skills.length} skills loaded and validated.`);
}

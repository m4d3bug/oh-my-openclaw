/**
 * oh-my-openclaw — OpenClaw plugin entry point
 *
 * On load:
 * 1. SKILL.md skills      → ~/.openclaw/skills/
 * 2. .js legacy skills    → ~/.openclaw/skills/
 * 3. agents (sources.json) → ~/.openclaw/agents/<name>/agent/BOOTSTRAP.md
 * 4. skill dependencies   → pip --user + npm -g (best effort)
 *
 * Mirrors docker/entrypoint.sh + docker/fetch-sources.py behavior.
 * Install: openclaw plugins install @m4d3bug/oh-my-openclaw
 */

import { readdirSync, readFileSync, existsSync, cpSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOME = process.env.HOME || process.env.USERPROFILE;
const OC_HOME = resolve(HOME, '.openclaw');
const OC_SKILLS = resolve(OC_HOME, 'skills');
const OC_AGENTS = resolve(OC_HOME, 'agents');
const LEARNINGS = resolve(OC_HOME, 'workspace', '.learnings');

function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', timeout: 60000 }).toString().trim();
  } catch { return null; }
}

// ── 1. SKILL.md directory skills ──────────────────────────────────────────
function syncSkillDirs() {
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

// ── 2. Legacy .js skill files ─────────────────────────────────────────────
function syncJsSkills() {
  const skillsDir = resolve(__dirname, 'skills');
  if (!existsSync(skillsDir)) return 0;
  mkdirSync(OC_SKILLS, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    cpSync(resolve(skillsDir, entry.name), resolve(OC_SKILLS, entry.name), { force: true });
    count++;
  }
  return count;
}

// ── 3. Agents from sources.json ───────────────────────────────────────────
function syncAgents() {
  const sourcesPath = resolve(__dirname, 'docker', 'sources.json');
  if (!existsSync(sourcesPath)) return 0;

  const sources = JSON.parse(readFileSync(sourcesPath, 'utf8'));
  const agents = (sources.agents || []).filter(a => a.name);
  let count = 0;

  for (const agent of agents) {
    const workspace = resolve(OC_AGENTS, agent.name, 'agent');
    mkdirSync(workspace, { recursive: true });

    for (const [filename, src] of Object.entries(agent.files || {})) {
      const dest = resolve(workspace, filename);
      if (src.local) {
        const localPath = resolve(__dirname, src.local);
        if (existsSync(localPath)) {
          cpSync(localPath, dest, { force: true });
          count++;
        }
      }
    }

    // Register agent with openclaw
    run(`openclaw agents add "${agent.name}" --workspace "${workspace}"`);
  }
  return count;
}

// ── 4. Skill dependencies ─────────────────────────────────────────────────
function installDeps() {
  const installed = [];
  const failed = [];

  // pip via get-pip.py (no root)
  if (!run('pip3 --version')) {
    run('curl -fsSL https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py');
    run('python3 /tmp/get-pip.py --user --break-system-packages -q');
  }

  // pip packages
  const pipPkgs = ['yt-dlp', 'feedparser', 'pytest'];
  for (const pkg of pipPkgs) {
    if (run(`pip3 install --user --break-system-packages -q ${pkg}`)) {
      installed.push(pkg);
    } else { failed.push(pkg); }
  }

  // yt-dlp standalone fallback
  if (failed.includes('yt-dlp')) {
    const bin = resolve(HOME, '.local', 'bin', 'yt-dlp');
    mkdirSync(dirname(bin), { recursive: true });
    if (run(`curl -fsSL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ${bin} && chmod +x ${bin}`)) {
      installed.push('yt-dlp(bin)');
      failed.splice(failed.indexOf('yt-dlp'), 1);
    }
  }

  // npm global packages (user prefix if needed)
  const npmPrefix = run('npm config get prefix');
  if (npmPrefix && !npmPrefix.startsWith(HOME)) {
    const userPrefix = resolve(HOME, '.npm-global');
    mkdirSync(userPrefix, { recursive: true });
    run(`npm config set prefix "${userPrefix}"`);
  }

  const npmPkgs = ['agent-browser', 'pyright', 'undici'];
  for (const pkg of npmPkgs) {
    if (run(`npm install -g ${pkg}`)) {
      installed.push(pkg);
    } else { failed.push(pkg); }
  }

  return { installed, failed };
}

// ── Entry point ───────────────────────────────────────────────────────────
export default {
  id: 'oh-my-openclaw',
  name: 'oh-my-openclaw',

  register(api) {
    const skills = syncSkillDirs();
    const jsSkills = syncJsSkills();
    const agents = syncAgents();
    mkdirSync(LEARNINGS, { recursive: true });

    console.log(`[oh-my-openclaw] Synced: ${skills} skills, ${jsSkills} .js skills, ${agents} agents`);

    // Install deps in background (don't block gateway startup)
    setTimeout(() => {
      const { installed, failed } = installDeps();
      if (installed.length) console.log(`[oh-my-openclaw] Deps installed: ${installed.join(', ')}`);
      if (failed.length) console.log(`[oh-my-openclaw] Deps failed: ${failed.join(', ')}`);
    }, 5000);
  },
};

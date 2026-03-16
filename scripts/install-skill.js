#!/usr/bin/env node
/**
 * oh-my-openclaw skill installer
 * Installs skills from remote URLs (like wechat-to-obsidian)
 *
 * Usage:
 *   node scripts/install-skill.js <url> [options]
 *
 * Example:
 *   node scripts/install-skill.js https://raw.githubusercontent.com/m4d3bug/wechat-to-obsidian/main/install.md
 *   omc install https://raw.githubusercontent.com/m4d3bug/wechat-to-obsidian/main/install.md
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { resolve, join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = resolve(ROOT, 'skills');

// ── CLI Arguments ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const installUrl = args[0];

if (!installUrl) {
  console.log(`
oh-my-openclaw skill installer

Usage:
  omc install <install-url> [options]

Example:
  omc install https://raw.githubusercontent.com/m4d3bug/wechat-to-obsidian/main/install.md

Options:
  --force    Overwrite existing skill
  --validate Run AgentGuard validation after install

Environment:
  OMC_SKILLS_DIR   Override default skills directory (default: ./skills)
`);
  process.exit(1);
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n[install] oh-my-openclaw skill installer');
  console.log(`[install] Fetching: ${installUrl}\n`);

  // Fetch install.md
  const installContent = await fetchInstallMd(installUrl);

  if (!installContent) {
    console.error('[install] Failed to fetch install.md');
    process.exit(1);
  }

  // Parse skill name from URL or content
  const skillName = extractSkillName(installContent, installUrl);

  if (!skillName) {
    console.error('[install] Could not determine skill name');
    process.exit(1);
  }

  console.log(`[install] Skill name: ${skillName}`);

  // Check if skill already exists
  const skillDir = resolve(SKILLS_DIR, skillName);
  if (existsSync(skillDir) && !args.includes('--force')) {
    console.error(`[install] Skill "${skillName}" already exists. Use --force to overwrite.`);
    process.exit(1);
  }

  // Create skills directory if needed
  if (!existsSync(SKILLS_DIR)) {
    mkdirSync(SKILLS_DIR, { recursive: true });
  }

  // Create skill directory
  if (!existsSync(skillDir)) {
    mkdirSync(skillDir, { recursive: true });
  }

  // Install dependencies first (npm install @goplus/agentguard)
  console.log('\n[install] Installing @goplus/agentguard...');
  spawnSync('npm', ['install', '@goplus/agentguard'], {
    cwd: ROOT,
    stdio: 'inherit',
  });

  // Parse and execute install steps
  await executeInstallSteps(installContent, skillDir);

  // Validate if requested
  if (args.includes('--validate')) {
    console.log('\n[install] Validating installed skill with AgentGuard...');
    const result = spawnSync('node', [
      resolve(ROOT, 'scripts/validate.js'),
      '--dir', skillDir,
      '--strict'
    ], {
      cwd: ROOT,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      console.error('[install] Validation failed');
      process.exit(1);
    }
  }

  console.log('\n✅ Skill installed successfully!');
  console.log(`   Location: ${skillDir}`);
}

async function fetchInstallMd(url) {
  // Convert GitHub raw URL format
  let fetchUrl = url;

  // Handle github.com URLs
  const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/(.+)/);
  if (githubMatch) {
    fetchUrl = `https://raw.githubusercontent.com/${githubMatch[1]}/${githubMatch[2]}/main/${githubMatch[3]}`;
    // Try master if main doesn't work
  }

  const result = spawnSync('curl', ['-sL', fetchUrl], {
    encoding: 'utf8',
    timeout: 30000,
  });

  if (result.status !== 0 || !result.stdout) {
    // Try with /main/ instead of /master/
    if (fetchUrl.includes('/master/')) {
      fetchUrl = fetchUrl.replace('/master/', '/main/');
      return fetchInstallMd(fetchUrl);
    }
    return null;
  }

  return result.stdout;
}

function extractSkillName(content, url) {
  // Try to get from first heading in install.md
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    // Convert to slug format: "wechat-to-obsidian" from "WeChat to Obsidian"
    return headingMatch[1]
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  // Try to extract from URL
  const match = url.match(/([a-zA-Z0-9_-]+)\/main\/install\.md$/);
  if (match) {
    return match[1];
  }

  return null;
}

async function executeInstallSteps(content, skillDir) {
  console.log('\n[install] Executing installation steps...');

  // Extract and run bash commands from install.md
  const codeBlocks = content.match(/```(?:bash|shell)?\n([\s\S]*?)```/g) || [];

  for (const block of codeBlocks) {
    const commands = block.replace(/```(?:bash|shell)?\n/, '')
      .replace(/```$/, '')
      .trim()
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'));

    for (const cmd of commands) {
      // Expand ~ to home directory
      const expandedCmd = cmd.replace(/~/g, process.env.HOME);

      console.log(`[install] $ ${expandedCmd}`);

      // Check if it's a curl download command - download to skill dir instead
      if (expandedCmd.startsWith('curl')) {
        // Extract target path
        const targetMatch = expandedCmd.match(/-o\s+(\S+)/);
        if (targetMatch) {
          let targetPath = targetMatch[1];
          // Convert ~ to home, then to skill dir
          targetPath = targetPath.replace(/~/g, process.env.HOME);
          targetPath = targetPath.replace(/\$HOME/, process.env.HOME);

          // Modify to save to skill directory
          const fileName = basename(targetPath);
          const newTarget = resolve(skillDir, fileName);

          const modifiedCmd = expandedCmd.replace(/-o\s+\S+/, `-o "${newTarget}"`);

          // Also handle mkdir - create in skill dir
          const mkdirMatch = expandedCmd.match(/mkdir\s+-p\s+(\S+)/);
          if (mkdirMatch) {
            const dirPath = mkdirMatch[1].replace(/~/g, process.env.HOME).replace(/\$HOME/, process.env.HOME);
            const newDir = resolve(skillDir, basename(dirPath));
            const mkdirCmd = `mkdir -p "${newDir}"`;
            console.log(`[install] $ ${mkdirCmd}`);
            spawnSync('bash', ['-c', mkdirCmd], { stdio: 'inherit' });
          }

          const result = spawnSync('bash', ['-c', modifiedCmd], { stdio: 'inherit' });
          if (result.status !== 0) {
            console.error(`[install] Command failed: ${modifiedCmd}`);
          }
          continue;
        }
      }

      // Regular command - modify paths to use skill directory
      let modifiedCmd = expandedCmd;

      // Handle mkdir with ~/.openclaw paths
      if (modifiedCmd.includes('~/.openclaw/workspace/skills/')) {
        const skillName = basename(skillDir);
        modifiedCmd = modifiedCmd.replace(
          /~\/\.openclaw\/workspace\/skills\/[^\/]+/,
          skillDir
        );
      }

      // Skip pip install for now - would need venv
      if (modifiedCmd.startsWith('pip ')) {
        console.log(`[install] Skipping: ${modifiedCmd}`);
        console.log(`         (Python deps should be handled separately)`);
        continue;
      }

      const result = spawnSync('bash', ['-c', modifiedCmd], {
        stdio: 'inherit',
      });

      if (result.status !== 0) {
        console.error(`[install] Command failed: ${modifiedCmd}`);
      }
    }
  }

  // Copy install.md to skill directory
  writeFileSync(resolve(skillDir, 'install.md'), content);
  console.log(`[install] Saved install.md to ${skillDir}/install.md`);
}

main().catch(err => {
  console.error('[install] Fatal error:', err);
  process.exit(1);
});
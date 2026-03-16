/**
 * self-improving-agent skill
 * Captures learnings, errors, and corrections to enable continuous improvement.
 *
 * Based on: https://github.com/peterskoett/self-improving-agent
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'fs';
import { resolve, join } from 'path';
import { homedir } from 'os';

export default {
  name: 'self-improving-agent',
  version: '1.0.0',
  description: 'Captures learnings, errors, and corrections to enable continuous improvement',
  commands: ['/learn', '/log', '/improve'],

  async handler(ctx) {
    const { message, args } = ctx;
    const subcmd = args[0];
    const content = args.slice(1).join(' ');

    const workspaceDir = resolve(homedir(), '.openclaw', 'workspace');
    const learningsDir = resolve(workspaceDir, '.learnings');

    // Ensure directories exist
    if (!existsSync(learningsDir)) {
      mkdirSync(learningsDir, { recursive: true });
    }

    const fileMap = {
      'error': resolve(learningsDir, 'ERRORS.md'),
      'learn': resolve(learningsDir, 'LEARNINGS.md'),
      'feature': resolve(learningsDir, 'FEATURE_REQUESTS.md'),
      'correction': resolve(learningsDir, 'LEARNINGS.md'),
      'knowledge': resolve(learningsDir, 'LEARNINGS.md'),
      'best': resolve(learningsDir, 'LEARNINGS.md'),
    };

    let targetFile = fileMap[subcmd] || resolve(learningsDir, 'LEARNINGS.md');
    let category = subcmd || 'general';

    if (!existsSync(targetFile)) {
      const template = `# ${require('path').basename(targetFile, '.md')}\n\n`;
      writeFileSync(targetFile, template);
    }

    const timestamp = new Date().toISOString();
    const entry = `\n## ${timestamp}\n\n${content}\n\n---\n`;

    appendFileSync(targetFile, entry);

    await ctx.reply(`✅ Logged to ${require('path').basename(targetFile)}`);
  },
};
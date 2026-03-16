/**
 * git skill — git operations via chat
 *
 * Usage:
 *   /git status
 *   /git diff
 *   /git commit "message"
 *   /git pr <title>
 */

import { execSync } from 'child_process';

function git(args, cwd) {
  return execSync(`git ${args}`, { cwd, encoding: 'utf8', stdio: 'pipe' });
}

export default {
  name: 'git',
  version: '1.0.0',
  description: 'Git operations from chat commands',
  commands: ['/git'],

  async handler(ctx) {
    const { message } = ctx;
    const parts = message.text.replace(/^\/git\s*/i, '').trim().split(/\s+/);
    const sub = parts[0];
    const cwd = ctx.env?.WORKSPACE ?? process.cwd();

    try {
      switch (sub) {
        case 'status':
          return ctx.reply('```\n' + git('status', cwd) + '\n```');

        case 'diff':
          return ctx.reply('```diff\n' + git('diff', cwd) + '\n```');

        case 'log':
          return ctx.reply('```\n' + git('log --oneline -10', cwd) + '\n```');

        case 'commit': {
          const msg = parts.slice(1).join(' ').replace(/^["']|["']$/g, '');
          if (!msg) return ctx.reply('Usage: /git commit "message"');
          git('add -A', cwd);
          git(`commit -m "${msg.replace(/"/g, '\\"')}"`, cwd);
          return ctx.reply(`Committed: ${msg}`);
        }

        case 'pr': {
          const title = parts.slice(1).join(' ');
          if (!title) return ctx.reply('Usage: /git pr <title>');
          const url = execSync(`gh pr create --title "${title}" --body "Created via oh-my-openclaw"`, {
            cwd, encoding: 'utf8',
          }).trim();
          return ctx.reply(`PR created: ${url}`);
        }

        default:
          return ctx.reply('Subcommands: status, diff, log, commit, pr');
      }
    } catch (err) {
      return ctx.reply(`Git error:\n\`\`\`\n${err.message}\n\`\`\``);
    }
  },
};

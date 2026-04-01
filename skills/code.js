/**
 * code skill — Claude Code-like file editing via chat
 *
 * Usage:
 *   /code read <file>
 *   /code edit <file> "<instruction>"
 *   /code new <file> "<description>"
 *   /code run <command>
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';

export default {
  name: 'code',
  version: '1.0.0',
  description: 'File reading, editing, and command execution',
  commands: ['/code'],

  async handler(ctx) {
    const { message, openclaw } = ctx;
    const raw = message.text.replace(/^\/code\s*/i, '').trim();
    const [sub, ...rest] = raw.split(/\s+/);
    const workspace = ctx.env?.WORKSPACE ?? '/workspace';

    try {
      switch (sub) {
        case 'read': {
          const file = resolve(workspace, rest[0]);
          const content = readFileSync(file, 'utf8');
          const ext = file.split('.').pop();
          return ctx.reply(`\`\`\`${ext}\n${content}\n\`\`\``);
        }

        case 'edit': {
          const file = resolve(workspace, rest[0]);
          const instruction = rest.slice(1).join(' ').replace(/^["']|["']$/g, '');
          const original = readFileSync(file, 'utf8');
          const edited = await openclaw.agent('backend', {
            prompt: `Edit this file as instructed. Return ONLY the complete new file content, no explanation.\n\nInstruction: ${instruction}\n\nOriginal:\n${original}`,
          });
          writeFileSync(file, edited);
          return ctx.reply(`Edited: ${rest[0]}`);
        }

        case 'new': {
          const file = resolve(workspace, rest[0]);
          const description = rest.slice(1).join(' ').replace(/^["']|["']$/g, '');
          const content = await openclaw.agent('backend', {
            prompt: `Create a new file. Return ONLY the file content, no explanation.\n\nFile: ${rest[0]}\nDescription: ${description}`,
          });
          writeFileSync(file, content);
          return ctx.reply(`Created: ${rest[0]}`);
        }

        case 'run': {
          const cmd = rest.join(' ');
          const output = execSync(cmd, { cwd: workspace, encoding: 'utf8', timeout: 30000 });
          return ctx.reply(`\`\`\`\n${output}\n\`\`\``);
        }

        default:
          return ctx.reply('Subcommands: read, edit, new, run');
      }
    } catch (err) {
      return ctx.reply(`Error:\n\`\`\`\n${err.message}\n\`\`\``);
    }
  },
};

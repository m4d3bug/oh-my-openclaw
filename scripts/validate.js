#!/usr/bin/env node
/**
 * oh-my-openclaw: AgentGuard validation runner
 *
 * Validates all skills and config files through @goplus/agentguard
 * before they are activated in openclaw. This runs both at build time
 * (inside Docker) and optionally at runtime.
 *
 * Usage:
 *   node validate.js --all            # validate built-in skills
 *   node validate.js --dir ./skills   # validate a custom directory
 *   node validate.js --file foo.js    # validate a single skill
 *   node validate.js --all --strict   # exit 1 on any warning
 *   node validate.js --all --report   # print full JSON report
 */

import { createRequire } from 'module';
import { readdir, readFile } from 'fs/promises';
import { resolve, extname } from 'path';
import { parseArgs } from 'util';

const require = createRequire(import.meta.url);

// ── AgentGuard bootstrap ────────────────────────────────────────────────────
let AgentGuard;
try {
  AgentGuard = require('@goplus/agentguard');
} catch {
  console.error('[validate] ERROR: @goplus/agentguard is not installed.');
  console.error('           Run: npm install @goplus/agentguard');
  process.exit(1);
}

// ── CLI args ────────────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    all:    { type: 'boolean', default: false },
    dir:    { type: 'string' },
    file:   { type: 'string' },
    strict: { type: 'boolean', default: false },
    report: { type: 'boolean', default: false },
  },
  allowPositionals: false,
});

const ROOT = new URL('..', import.meta.url).pathname;

// ── Collect files to validate ────────────────────────────────────────────────
async function collectFiles() {
  const files = [];

  if (args.file) {
    files.push(resolve(args.file));
  }

  if (args.dir) {
    const entries = await readdir(resolve(args.dir), { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && ['.js', '.ts', '.mjs'].includes(extname(e.name))) {
        files.push(resolve(args.dir, e.name));
      }
    }
  }

  if (args.all) {
    const builtinDirs = [
      resolve(ROOT, 'skills'),
      resolve(ROOT, '.openclaw', 'skills'),
    ];
    for (const dir of builtinDirs) {
      try {
        const entries = await readdir(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.isFile() && ['.js', '.ts', '.mjs'].includes(extname(e.name))) {
            files.push(resolve(dir, e.name));
          }
        }
      } catch {
        // dir may not exist; skip silently
      }
    }
  }

  return [...new Set(files)];
}

// ── Run validation ───────────────────────────────────────────────────────────
async function main() {
  const files = await collectFiles();

  if (files.length === 0) {
    console.log('[validate] No files to validate.');
    process.exit(0);
  }

  console.log(`[validate] Scanning ${files.length} file(s) with AgentGuard...`);

  const guard = new AgentGuard.Scanner({ rules: 'all' });
  const results = [];
  let hasError = false;
  let hasWarning = false;

  for (const filePath of files) {
    const source = await readFile(filePath, 'utf8');
    const result = await guard.scan({ source, filePath });
    results.push({ filePath, ...result });

    const rel = filePath.replace(ROOT, '');

    if (result.errors?.length) {
      hasError = true;
      console.error(`[validate] FAIL  ${rel}`);
      for (const e of result.errors) {
        console.error(`           ERR  ${e.rule}: ${e.message}`);
      }
    } else if (result.warnings?.length) {
      hasWarning = true;
      console.warn(`[validate] WARN  ${rel}`);
      if (args.strict) {
        for (const w of result.warnings) {
          console.warn(`           WARN ${w.rule}: ${w.message}`);
        }
      }
    } else {
      console.log(`[validate] OK    ${rel}`);
    }
  }

  if (args.report) {
    console.log('\n[validate] Full report:');
    console.log(JSON.stringify(results, null, 2));
  }

  if (hasError) {
    console.error('\n[validate] Validation FAILED — skills contain security errors.');
    process.exit(1);
  }

  if (args.strict && hasWarning) {
    console.error('\n[validate] Validation FAILED (strict mode) — warnings treated as errors.');
    process.exit(1);
  }

  console.log('\n[validate] All skills passed AgentGuard validation.');
}

main().catch(err => {
  console.error('[validate] Unexpected error:', err);
  process.exit(1);
});

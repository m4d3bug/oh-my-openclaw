#!/usr/bin/env node
/**
 * oh-my-openclaw skill validator
 * Uses @goplus/agentguard to validate skills before use
 *
 * Usage:
 *   node scripts/validate.js --all                    # validate all built-in skills
 *   node scripts/validate.js --dir <path>             # validate custom skill directory
 *   node scripts/validate.js --file <path>            # validate single file
 *   node scripts/validate.js --strict                 # treat warnings as errors
 *   node scripts/validate.js --report                  # print full JSON report
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { resolve, join, extname } from 'path';
import { fileURLToPath } from 'url';
import AgentGuard from '@goplus/agentguard';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── CLI Arguments ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const options = {
  all: args.includes('--all'),
  dir: extractArg('--dir'),
  file: extractArg('--file'),
  strict: args.includes('--strict'),
  report: args.includes('--report'),
};

function extractArg(flag) {
  const idx = args.indexOf(flag);
  return idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith('--')
    ? args[idx + 1]
    : null;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n[validate] oh-my-openclaw skill validator');
  console.log('[validate] Using @goplus/agentguard for security checks\n');

  const files = collectFiles();

  if (files.length === 0) {
    console.log('[validate] No skill files to validate.');
    process.exit(0);
  }

  console.log(`[validate] Found ${files.length} file(s) to validate:\n`);
  files.forEach(f => console.log(`  - ${f}`));
  console.log('');

  const results = await validateFiles(files);

  // Print report if requested
  if (options.report) {
    console.log('\n=== Full Report ===\n');
    console.log(JSON.stringify(results, null, 2));
  }

  // Check for failures
  const failed = results.filter(r => r.severity === 'error');
  const warnings = results.filter(r => r.severity === 'warning');

  if (failed.length > 0) {
    console.log(`\n[validate] ❌ ${failed.length} error(s) found`);
    console.log('[validate] Run with --report for details');
    process.exit(options.strict ? 1 : 0);
  }

  if (warnings.length > 0 && options.strict) {
    console.log(`\n[validate] ⚠️ ${warnings.length} warning(s) found (strict mode)`);
    process.exit(1);
  }

  console.log(`\n[validate] ✅ All skills passed validation`);
  process.exit(0);
}

function collectFiles() {
  const files = [];

  if (options.all) {
    // Validate all built-in skills
    const skillsDir = resolve(ROOT, 'skills');
    if (existsSync(skillsDir)) {
      for (const file of readdirSync(skillsDir)) {
        if (file.endsWith('.js')) {
          files.push(resolve(skillsDir, file));
        }
      }
    }
  }

  if (options.dir) {
    const dirPath = resolve(options.dir);
    if (existsSync(dirPath)) {
      for (const file of readdirSync(dirPath)) {
        if (file.endsWith('.js')) {
          files.push(resolve(dirPath, file));
        }
      }
    }
  }

  if (options.file) {
    const filePath = resolve(options.file);
    if (existsSync(filePath)) {
      files.push(filePath);
    }
  }

  return [...new Set(files)]; // deduplicate
}

async function validateFiles(files) {
  const results = [];

  for (const file of files) {
    console.log(`[validate] Checking: ${file}`);
    try {
      const content = readFileSync(file, 'utf8');
      const report = await AgentGuard.validate(content, {
        file: file,
        strict: options.strict,
      });

      if (report.issues && report.issues.length > 0) {
        for (const issue of report.issues) {
          results.push({
            file,
            severity: issue.severity,
            message: issue.message,
            line: issue.line,
          });

          const prefix = issue.severity === 'error' ? '❌' : '⚠️';
          console.log(`  ${prefix} ${issue.severity}: ${issue.message}`);
        }
      } else {
        console.log('  ✅ No issues found');
      }
    } catch (err) {
      results.push({
        file,
        severity: 'error',
        message: `Validation failed: ${err.message}`,
      });
      console.log(`  ❌ Error: ${err.message}`);
    }
  }

  return results;
}

main().catch(err => {
  console.error('[validate] Fatal error:', err);
  process.exit(1);
});
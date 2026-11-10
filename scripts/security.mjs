/* eslint security/detect-non-literal-fs-filename: off -- private scan directories are constrained to scratch */
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import {
  publishedFiles,
  checkPublication,
  copyPublication,
  copyBuilds,
} from './security-files.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const windows = process.platform === 'win32';
const scratch = resolve(root, 'scratch', 'publication-scans');
const directory = resolve(scratch, String(process.pid));
if (!directory.startsWith(scratch + sep)) throw new Error('Unsafe scan directory.');
mkdirSync(directory, { recursive: true });

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: windows && command === 'pnpm',
  });
  if (result.status !== 0) throw new Error(`${command} security check failed.`);
}

try {
  const files = publishedFiles(root);
  checkPublication(files);
  copyPublication(root, join(directory, 'source'), files);
  const tokens = copyBuilds(root, directory);
  const config = join(directory, 'gitleaks.toml');
  const allowlist = tokens.length
    ? `\n[[allowlists]]\ndescription = "Public Supabase anon keys"\nregexTarget = "secret"\nregexes = [${tokens.map((token) => `'${token.replaceAll('.', '\\.')}\u0027`).join(',')}]\n`
    : '';
  writeFileSync(config, `[extend]\nuseDefault = true\n${allowlist}`);
  const cached = join(root, 'scratch', 'android-tools', 'gitleaks', 'gitleaks.exe');
  const gitleaks = windows && existsSync(cached) ? cached : 'gitleaks';
  run(gitleaks, ['detect', '--source', root, '--no-banner', '--redact']);
  run(gitleaks, [
    'detect',
    '--no-git',
    '--source',
    directory,
    '--config',
    config,
    '--no-banner',
    '--redact',
  ]);
  run('pnpm', ['audit', '--audit-level=high']);
  console.log(
    'Publication policy, history, source, compiled secrets and dependency checks passed.',
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}

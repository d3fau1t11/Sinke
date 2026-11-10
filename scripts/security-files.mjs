/* eslint security/detect-non-literal-fs-filename: off -- paths come from Git within the repository */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

export function publishedFiles(root) {
  const result = spawnSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    {
      cwd: root,
      encoding: 'utf8',
    },
  );
  if (result.status !== 0) throw new Error('Could not inspect publication files.');
  return [...new Set(result.stdout.split('\0').filter(Boolean))].filter((path) =>
    existsSync(join(root, path)),
  );
}

export function checkPublication(files) {
  const blocked = files.filter((path) => {
    const name = basename(path).toLowerCase();
    if (extname(path).toLowerCase() === '.md') return path !== 'README.md';
    if (name.startsWith('.env')) return name !== '.env.example';
    return (
      /\.(jks|keystore|p12|pfx|pem|key)$/i.test(path) ||
      /google-services\.json|googleservice-info\.plist|service-account.*\.json/i.test(name) ||
      /(^|\/)(node_modules|dist|scratch|release-apks)\//.test(path)
    );
  });
  if (blocked.length)
    throw new Error(`Private or excluded publication files: ${blocked.join(', ')}`);
}

export function copyPublication(root, directory, files) {
  for (const path of files) {
    const output = join(directory, path);
    mkdirSync(join(output, '..'), { recursive: true });
    cpSync(join(root, path), output);
  }
}

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

export function copyBuilds(root, directory) {
  const publicTokens = new Set();
  for (const app of ['customer', 'merchant', 'rider', 'admin']) {
    const dist = join(root, 'apps', app, 'dist');
    if (!existsSync(dist)) throw new Error(`Build ${app} before scanning compiled files.`);
    for (const path of walk(dist).filter((item) => /\.(js|html|json|map)$/.test(item))) {
      const source = readFileSync(path, 'utf8');
      const tokens = source.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) ?? [];
      for (const token of tokens) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
        if (payload.role !== 'anon') throw new Error(`Non-public token in ${app} build.`);
        publicTokens.add(token);
      }
      const output = join(directory, 'compiled', app, relative(dist, path));
      mkdirSync(join(output, '..'), { recursive: true });
      cpSync(path, output);
    }
  }
  return [...publicTokens];
}

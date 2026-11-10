/* eslint security/detect-non-literal-fs-filename: off -- all app paths use validated role/flavor values */
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseAndroidArgs, signingVariableNames, versionFromTag } from './android-options.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const windows = process.platform === 'win32';

function run(command, args, cwd, env) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: 'inherit',
    shell: windows,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (exit ${result.status}).`);
}

function getVersion(release) {
  const args = ['describe', '--tags', '--match', 'v[0-9]*'];
  args.push(release ? '--exact-match' : '--abbrev=0');
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0 && !release) return { code: 10000, name: '1.0.0' };
  return versionFromTag(result.stdout.trim());
}

function checkRelease(role, flavor, buildType, appDir) {
  if (
    flavor !== 'dev' &&
    !['', '.local'].some((suffix) => existsSync(join(appDir, `.env.${flavor}${suffix}`)))
  ) {
    throw new Error(`Configure apps/${role}/.env.${flavor}.local for this Supabase environment.`);
  }
  if (buildType !== 'release') return;
  const environment = new Map(Object.entries(process.env));
  const missing = signingVariableNames(role).filter((name) => !environment.get(name));
  if (missing.length) throw new Error(`Set the app's signing variables: ${missing.join(', ')}.`);
}

function androidEnvironment() {
  const env = { ...process.env };
  const cachedJdk = join(root, 'scratch', 'android-tools', 'jdk21');
  if (!env.JAVA_HOME && existsSync(join(cachedJdk, 'bin', windows ? 'java.exe' : 'java'))) {
    env.JAVA_HOME = cachedJdk;
  }
  const sdkDefault = windows
    ? join(homedir(), 'AppData', 'Local', 'Android', 'Sdk')
    : join(homedir(), 'Library', 'Android', 'sdk');
  const sdk = env.ANDROID_HOME || env.ANDROID_SDK_ROOT || sdkDefault;
  if (existsSync(sdk)) env.ANDROID_HOME = sdk;
  return env;
}

function buildAndroid(options) {
  const { role, flavor, buildType } = options;
  const appDir = join(root, 'apps', role);
  const androidDir = join(appDir, 'android');
  if (!existsSync(join(androidDir, 'gradlew'))) {
    throw new Error(
      `Native Android project missing for ${role}. Run pnpm --filter @senik/${role} exec cap add android.`,
    );
  }
  checkRelease(role, flavor, buildType, appDir);
  const version = getVersion(buildType === 'release');
  const env = {
    ...androidEnvironment(),
    SENIK_BUILD_MODE: flavor,
    SENIK_VERSION_CODE: String(version.code),
    SENIK_VERSION_NAME: version.name,
  };
  if (env.ANDROID_HOME && !existsSync(join(androidDir, 'local.properties'))) {
    writeFileSync(
      join(androidDir, 'local.properties'),
      `sdk.dir=${env.ANDROID_HOME.replaceAll('\\', '/')}\n`,
    );
  }
  run('pnpm', ['exec', 'turbo', 'build', `--filter=@senik/${role}`], root, env);
  run('pnpm', ['--filter', `@senik/${role}`, 'exec', 'cap', 'sync', 'android'], root, env);
  const variant = flavor[0].toUpperCase() + flavor.slice(1);
  const task = buildType === 'release' ? `bundle${variant}Release` : `assemble${variant}Debug`;
  run(
    windows ? 'gradlew.bat' : 'sh',
    windows ? [task, '--console=plain'] : ['./gradlew', task, '--console=plain'],
    androidDir,
    env,
  );
  const relativeOutput =
    buildType === 'release'
      ? `bundle/${flavor}Release/app-${flavor}-release.aab`
      : `apk/${flavor}/debug/app-${flavor}-debug.apk`;
  const extension = buildType === 'release' ? 'aab' : 'apk';
  const output = join(root, 'release-apks', `senik-${role}-${flavor}-${buildType}.${extension}`);
  mkdirSync(join(root, 'release-apks'), { recursive: true });
  copyFileSync(join(androidDir, 'app/build/outputs', relativeOutput), output);
  console.log(`Built Senik ${role}: ${output}`);
}

try {
  buildAndroid(parseAndroidArgs(process.argv.slice(2)));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

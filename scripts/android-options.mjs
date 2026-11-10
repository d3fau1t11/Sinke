const roles = new Set(['customer', 'merchant', 'rider']);
const flavors = new Set(['dev', 'staging', 'prod']);
const buildTypes = new Set(['debug', 'release']);

export function parseAndroidArgs(args) {
  const [role, flavor = 'dev', buildType = 'debug'] = args;
  if (args.length > 3 || !roles.has(role) || !flavors.has(flavor) || !buildTypes.has(buildType)) {
    throw new Error(
      'Usage: pnpm android:<customer|merchant|rider> [dev|staging|prod] [debug|release]',
    );
  }
  if (buildType === 'release' && flavor !== 'prod') {
    throw new Error('Signed releases must use the prod environment.');
  }
  return { role, flavor, buildType };
}

export function versionFromTag(tag) {
  const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag);
  if (!match) throw new Error('Release version must be a Git tag like v1.2.3.');
  const [major, minor, patch] = match.slice(1).map(Number);
  const code = major * 10000 + minor * 100 + patch;
  if (minor > 99 || patch > 99 || code < 1 || code > 2100000000) {
    throw new Error('Git tag cannot be represented as an Android version code.');
  }
  return { code, name: match.slice(1).join('.') };
}

export function signingVariableNames(role) {
  if (!roles.has(role)) throw new Error('Unknown Android app.');
  const prefix = `SENIK_${role.toUpperCase()}_`;
  return ['KEYSTORE_PATH', 'KEYSTORE_PASSWORD', 'KEY_ALIAS', 'KEY_PASSWORD'].map(
    (suffix) => prefix + suffix,
  );
}

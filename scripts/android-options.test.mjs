import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseAndroidArgs, signingVariableNames, versionFromTag } from './android-options.mjs';

test('rejects unexpected apps, paths, environments, and command arguments before building', () => {
  for (const args of [
    ['admin'],
    ['../customer'],
    ['customer', '../prod'],
    ['rider', 'dev', 'debug', '--init-script=external.gradle'],
    ['merchant', 'prod', 'publish'],
  ]) {
    assert.throws(() => parseAndroidArgs(args), /Usage/);
  }
});

test('keeps non-production builds out of the signed release workflow', () => {
  assert.throws(() => parseAndroidArgs(['customer', 'dev', 'release']), /prod environment/);
  assert.throws(() => parseAndroidArgs(['rider', 'staging', 'release']), /prod environment/);
  assert.deepEqual(parseAndroidArgs(['merchant', 'prod', 'release']), {
    role: 'merchant',
    flavor: 'prod',
    buildType: 'release',
  });
});

test('encodes Git versions monotonically and rejects ambiguous version codes', () => {
  assert.deepEqual(versionFromTag('v1.2.3'), { code: 10203, name: '1.2.3' });
  assert.ok(versionFromTag('v2.0.0').code > versionFromTag('v1.99.99').code);
  for (const tag of ['1.2.3', 'v1.100.0', 'v1.0.100', 'v0.0.0', 'v999999.0.0']) {
    assert.throws(() => versionFromTag(tag));
  }
});

test('each app requires a separate set of signing credentials', () => {
  const customer = signingVariableNames('customer');
  const merchant = signingVariableNames('merchant');
  const rider = signingVariableNames('rider');
  assert.equal(new Set([...customer, ...merchant, ...rider]).size, 12);
  assert.throws(() => signingVariableNames('../customer'), /Unknown/);
});

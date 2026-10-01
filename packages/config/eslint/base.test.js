const { describe, it, expect } = require('vitest');
const base = require('./base');

describe('eslint base config', () => {
  it('has max-lines rule set to 200', () => {
    expect(base.rules['max-lines']).toEqual(['error', 200]);
  });

  it('has max-lines-per-function rule set to 60', () => {
    expect(base.rules['max-lines-per-function'][1]).toBe(60);
  });

  it('has complexity rule set to 10', () => {
    expect(base.rules['complexity']).toEqual(['error', 10]);
  });

  it('has security plugin enabled', () => {
    expect(base.plugins).toContain('security');
  });

  it('ignores node_modules and dist', () => {
    expect(base.ignorePatterns).toContain('node_modules/');
    expect(base.ignorePatterns).toContain('dist/');
  });
});
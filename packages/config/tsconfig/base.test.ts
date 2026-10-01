import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('tsconfig base', () => {
  const config = JSON.parse(readFileSync(resolve(__dirname, 'base.json'), 'utf-8'));

  it('has strict mode enabled', () => {
    expect(config.compilerOptions.strict).toBe(true);
  });

  it('has noUncheckedIndexedAccess enabled', () => {
    expect(config.compilerOptions.noUncheckedIndexedAccess).toBe(true);
  });

  it('has exactOptionalPropertyTypes enabled', () => {
    expect(config.compilerOptions.exactOptionalPropertyTypes).toBe(true);
  });

  it('has noEmit enabled', () => {
    expect(config.compilerOptions.noEmit).toBe(true);
  });

  it('excludes node_modules and dist', () => {
    expect(config.exclude).toContain('node_modules');
    expect(config.exclude).toContain('dist');
  });
});
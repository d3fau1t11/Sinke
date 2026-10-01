const { describe, it, expect } = require('vitest');
const config = require('./prettier.config');

describe('prettier config', () => {
  it('uses single quotes', () => {
    expect(config.singleQuote).toBe(true);
  });

  it('uses trailing commas', () => {
    expect(config.trailingComma).toBe('es5');
  });

  it('has print width of 100', () => {
    expect(config.printWidth).toBe(100);
  });

  it('uses semicolons', () => {
    expect(config.semi).toBe(true);
  });
});
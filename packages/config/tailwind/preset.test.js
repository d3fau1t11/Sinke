const { describe, it, expect } = require('vitest');
const preset = require('./preset');

describe('tailwind preset', () => {
  it('has primary color defined', () => {
    expect(preset.theme.extend.colors.primary).toBe('#a73400');
  });

  it('has secondary color defined', () => {
    expect(preset.theme.extend.colors.secondary).toBe('#1b6d24');
  });

  it('has tertiary color defined', () => {
    expect(preset.theme.extend.colors.tertiary).toBe('#874e00');
  });

  it('has surface color defined', () => {
    expect(preset.theme.extend.colors.surface).toBe('#fff8f5');
  });

  it('has on-surface color defined', () => {
    expect(preset.theme.extend.colors['on-surface']).toBe('#261911');
  });

  it('has font families defined', () => {
    expect(preset.theme.extend.fontFamily.sans).toContain('Inter');
    expect(preset.theme.extend.fontFamily.display).toContain('Plus Jakarta Sans');
  });

  it('has border radius defined', () => {
    expect(preset.theme.extend.borderRadius.lg).toBe('1rem');
  });

  it('has box shadows defined', () => {
    expect(preset.theme.extend.boxShadow['level-1']).toBeDefined();
    expect(preset.theme.extend.boxShadow['level-2']).toBeDefined();
  });
});
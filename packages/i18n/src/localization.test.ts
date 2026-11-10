import { describe, it, expect } from 'vitest';
import { i18n } from './index';
import { systemAm as am } from './locales/am';
import { systemEn as en } from './locales/en';

describe('system languages', () => {
  it('covers every English interface label in Amharic', () => {
    expect(Object.keys(am).sort()).toEqual(Object.keys(en).sort());
    for (const translated of Object.values(am)) expect(translated.trim()).not.toBe('');
  });
  it('resolves regional device languages and translates role menus', async () => {
    await i18n.changeLanguage('am-ET');
    expect(i18n.resolvedLanguage).toBe('am');
    expect(i18n.t('Menu', { ns: 'system' })).toBe('ሜኑ');
    expect(i18n.t('Delivery History', { ns: 'system' })).toBe('የማድረስ ታሪክ');
    await i18n.changeLanguage('en-US');
    expect(i18n.resolvedLanguage).toBe('en');
    expect(i18n.t('Menu', { ns: 'system' })).toBe('Menu');
  });
});

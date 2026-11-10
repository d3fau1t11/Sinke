import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { am, systemAm } from './locales/am';
import { en, systemEn } from './locales/en';

export const defaultNS = 'common';
export const fallbackLng = 'am';

const resources = {
  am: { common: am, system: systemAm },
  en: { common: en, system: systemEn },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    supportedLngs: ['am', 'en'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    defaultNS,
    ns: ['common', 'system'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'senik-lang',
    },
  });

export function useApp() {
  const { t, i18n: i18nInstance } = useTranslation();
  return {
    t,
    lang: i18nInstance.resolvedLanguage ?? fallbackLng,
    isAm: (i18nInstance.resolvedLanguage ?? fallbackLng) === 'am',
    toggleLanguage: () =>
      i18nInstance.changeLanguage(i18nInstance.resolvedLanguage === 'am' ? 'en' : 'am'),
    setLanguage: (lang: 'am' | 'en') => i18nInstance.changeLanguage(lang),
  };
}

export function useText() {
  const { t } = useTranslation('system');
  return (value: string | number, variables?: Record<string, string | number>) =>
    t(String(value), {
      keySeparator: false,
      nsSeparator: false,
      defaultValue: String(value),
      ...variables,
    });
}

export function useLocalizedName() {
  const { isAm } = useApp();
  return (item: { name_am: string; name_en: string } | null | undefined) =>
    item ? (isAm ? item.name_am || item.name_en : item.name_en || item.name_am) : '';
}

function updateDocumentLanguage() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = i18n.resolvedLanguage ?? fallbackLng;
    document.documentElement.dir = 'ltr';
  }
}
i18n.on('languageChanged', updateDocumentLanguage);
i18n.on('initialized', updateDocumentLanguage);
updateDocumentLanguage();

export { i18n };
export default i18n;

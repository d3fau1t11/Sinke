import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { am } from './locales/am';
import { en } from './locales/en';

export const defaultNS = 'common';
export const fallbackLng = 'am';

const resources = {
  am: { common: am },
  en: { common: en }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    defaultNS,
    ns: ['common'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'senik-lang'
    }
  });

export function useApp() {
  const { t, i18n: i18nInstance } = useTranslation();
  return {
    t,
    lang: i18nInstance.language,
    isAm: i18nInstance.language === 'am',
    toggleLanguage: () => i18nInstance.changeLanguage(i18nInstance.language === 'am' ? 'en' : 'am'),
    setLanguage: (lang: string) => i18nInstance.changeLanguage(lang)
  };
}

export { i18n };
export default i18n;
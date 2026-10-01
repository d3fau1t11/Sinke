import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'am';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'am',

      setLanguage: (lang) => set({ language: lang }),

      toggleLanguage: () => {
        const current = get().language;
        set({ language: current === 'am' ? 'en' : 'am' });
      },
    }),
    {
      name: 'senik-language',
    }
  )
);

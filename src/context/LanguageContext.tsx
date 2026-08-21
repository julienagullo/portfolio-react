import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { DEFAULT_LANGUAGE, type Language } from '../config/config.ts';
import { t as translate, type TranslationKey } from '../config/lang.ts';

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      toggleLanguage,
      t: (key: TranslationKey) => translate(language, key),
    }),
    [language, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { translations, DEFAULT_LANG, SUPPORTED_LANGS } from '@/i18n/translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LANG;
    const stored = window.localStorage.getItem('lang');
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const browser = (navigator.language || '').slice(0, 2);
    return SUPPORTED_LANGS.includes(browser) ? browser : DEFAULT_LANG;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const dict = translations[lang] || translations[DEFAULT_LANG];
    const t = (key) => {
      const fromCurrent = key.split('.').reduce((o, k) => (o ? o[k] : undefined), dict);
      if (fromCurrent !== undefined) return fromCurrent;
      const fallback = key.split('.').reduce((o, k) => (o ? o[k] : undefined), translations[DEFAULT_LANG]);
      return fallback ?? key;
    };
    return { lang, setLang, t, supported: SUPPORTED_LANGS };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

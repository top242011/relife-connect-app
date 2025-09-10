'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en } from '@/lib/i18n/en';
import { th } from '@/lib/i18n/th';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = { en, th };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('th');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLanguage = localStorage.getItem('polityconnect-lang') as Language;
    if (storedLanguage && ['en', 'th'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
        localStorage.setItem('polityconnect-lang', lang);
        document.documentElement.lang = lang;
    }
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = dictionaries[language][key] || dictionaries['en'][key] || key;
    if (replacements) {
        Object.keys(replacements).forEach((placeholder) => {
            translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  }, [language]);
  
  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = language;
    }
  }, [language, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

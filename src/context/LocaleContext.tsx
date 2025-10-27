"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, defaultLocale } from '../lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load translations when locale changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../locales/${locale}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        // Fallback to default locale
        if (locale !== defaultLocale) {
          const fallbackModule = await import(`../locales/${defaultLocale}.json`);
          setTranslations(fallbackModule.default);
        }
      }
    };

    loadTranslations();
  }, [locale]);

  // Translation function - supports nested keys like 'nav.dashboard'
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: Record<string, unknown> | string = translations;
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = (value as Record<string, unknown>)[k] as Record<string, unknown> | string;
      }
      if (value === undefined) break;
    }
    
    return (typeof value === 'string' ? value : key);
  };

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['en', 'vi', 'ja', 'ko', 'zh'].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  // Save locale to localStorage when it changes
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};
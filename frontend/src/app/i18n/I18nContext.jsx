'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from './translations/en.json';
import jaTranslations from './translations/ja.json';

const I18nContext = createContext();

const translations = {
  en: enTranslations,
  ja: jaTranslations,
};

export function I18nProvider({ children, defaultLocale = 'en' }) {
  // Initialize with 'en' as default, check localStorage on mount
  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      return savedLocale || defaultLocale;
    }
    return defaultLocale;
  });

  useEffect(() => {
    // Ensure default is 'en' if no locale is saved
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      if (!savedLocale) {
        setLocale(defaultLocale);
        localStorage.setItem('locale', defaultLocale);
      } else {
        setLocale(savedLocale);
      }
    }
  }, [defaultLocale]);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    // Always fallback to English if locale is invalid
    const currentLocale = (locale && translations[locale]) ? locale : 'en';
    let value = translations[currentLocale] || translations['en'];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if translation not found
        value = translations['en'];
        for (const k2 of keys) {
          value = value?.[k2];
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }

    // Replace parameters in translation string
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  };

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

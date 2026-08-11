import React, { createContext, useState, useContext, useEffect } from 'react';
// Import the full translation files
import enTranslations from '../locales/en/common.json';
import amTranslations from '../locales/am/common.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const getInitialLanguage = () => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Use the full translation files
  const translations = {
    en: enTranslations,
    am: amTranslations
  };

  const t = (key) => {
    if (!translations[language]) {
      return translations.en[key] || key;
    }
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'am' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

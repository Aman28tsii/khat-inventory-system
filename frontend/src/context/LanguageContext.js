import React, { createContext, useState, useContext, useEffect } from 'react';

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

  const translations = {
    en: {
      search: "Search...",
      welcome: "Welcome",
      profile: "My Profile",
      changePassword: "Change Password",
      notifications: "Notifications",
      logout: "Logout",
      user: "User"
    },
    am: {
      search: "ፈልግ...",
      welcome: "እንኳን ደህና መጡ",
      profile: "መገለጫ",
      changePassword: "የይለፍ ቃል ቀይር",
      notifications: "ማሳወቂያዎች",
      logout: "ውጣ",
      user: "ተጠቃሚ"
    }
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

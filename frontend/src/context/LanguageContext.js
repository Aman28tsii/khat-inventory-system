import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Read localStorage on initial load
  const getInitialLanguage = () => {
    const saved = localStorage.getItem('language');
    console.log('Initial language from localStorage:', saved); // Debug
    return saved || 'en';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    console.log('Language changed to:', language);
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
    const result = translations[language]?.[key] || key;
    console.log(	('') = '' ()); // Debug
    return result;
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'am' : 'en';
    console.log('Toggling to:', newLang);
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    // Force page reload to ensure all components update
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

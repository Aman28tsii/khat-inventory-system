import { useState, useEffect, createContext, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({
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
      welcome: "እንኳን በደህና መጡ",
      profile: "መገለጫ",
      changePassword: "የይለፍ ቃል ቀይር",
      notifications: "ማሳወቂያዎች",
      logout: "ውጣ",
      user: "ተጠቃሚ"
    }
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'am' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    window.dispatchEvent(new Event('languageChanged'));
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
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

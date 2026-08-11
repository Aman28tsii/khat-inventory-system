import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    search: "Search...",
    welcome: "Welcome",
    profile: "My Profile",
    changePassword: "Change Password",
    notifications: "Notifications",
    logout: "Logout",
    user: "User",
    dashboard: "Dashboard",
    inventory: "Inventory",
    sales: "Sales",
    purchases: "Purchases",
    transfers: "Transfers",
    reports: "Reports",
    customers: "Customers",
    suppliers: "Suppliers",
    users: "Users",
    roles: "Roles",
    branches: "Branches",
    settings: "Settings"
  },
  am: {
    search: "ፈልግ...",
    welcome: "እንኳን ደህና መጡ",
    profile: "መገለጫ",
    changePassword: "የይለፍ ቃል ቀይር",
    notifications: "ማሳወቂያዎች",
    logout: "ውጣ",
    user: "ተጠቃሚ",
    dashboard: "ዳሽቦርድ",
    inventory: "ኢንቬንተሪ",
    sales: "ሽያጭ",
    purchases: "ግዢ",
    transfers: "ዝውውር",
    reports: "ሪፖርቶች",
    customers: "ደንበኞች",
    suppliers: "አቅራቢዎች",
    users: "ተጠቃሚዎች",
    roles: "ሚናዎች",
    branches: "ቅርንጫፎች",
    settings: "ቅንብሮች"
  }
};

export const LanguageProvider = ({ children }) => {
  // FIX: Force read from localStorage on every mount
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    console.log('LanguageProvider init - reading from localStorage:', saved);
    if (saved === 'en' || saved === 'am') {
      return saved;
    }
    return 'en';
  });

  useEffect(() => {
    console.log('LanguageProvider effect - language set to:', language);
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const result = translations[language]?.[key] || key;
    return result;
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'am' : 'en';
    console.log('Toggle language to:', newLang);
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

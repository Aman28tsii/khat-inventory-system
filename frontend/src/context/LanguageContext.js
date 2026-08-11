import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

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
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      create: "Create",
      update: "Update",
      close: "Close",
      submit: "Submit",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
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
      settings: "Settings",
      user: "User"
    },
    am: {
      search: "ፈልግ...",
      welcome: "እንኳን በደህና መጡ",
      profile: "መገለጫ",
      changePassword: "የይለፍ ቃል ቀይር",
      notifications: "ማሳወቂያዎች",
      logout: "ውጣ",
      loading: "በመጫን ላይ...",
      save: "አስቀምጥ",
      cancel: "ሰርዝ",
      delete: "ሰርዝ",
      edit: "አስተካክል",
      add: "ጨምር",
      create: "ፍጠር",
      update: "አዘምን",
      close: "ዝጋ",
      submit: "አስገባ",
      confirm: "አረጋግጥ",
      yes: "አዎ",
      no: "አይ",
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
      settings: "ቅንብሮች",
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

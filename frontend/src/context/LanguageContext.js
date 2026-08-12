import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Common
    appName: "Khat Inventory",
    search: "Search",
    welcome: "Welcome",
    profile: "My Profile",
    changePassword: "Change Password",
    notifications: "Notifications",
    logout: "Logout",
    user: "User",
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
    print: "Print",
    export: "Export",
    refresh: "Refresh",
    clear: "Clear",
    upload: "Upload",
    all: "All",
    none: "None",
    or: "or",
    notes: "Notes",
    contact: "Contact",
    warning: "Warning",
    success: "Success",
    status: "Status",
    amount: "Amount",
    total: "Total",
    
    // Navigation
    dashboard: "Dashboard",
    inventory: "Inventory",
    products: "Products",
    batches: "Batches",
    stockMovements: "Stock Movements",
    sales: "Sales",
    purchases: "Purchases",
    transfers: "Transfers",
    reports: "Reports",
    customers: "Customers",
    suppliers: "Suppliers",
    users: "Users",
    roles: "Roles & Permissions",
    branches: "Branches",
    settings: "Settings",
    auditLogs: "Audit Logs",
    
    // Navigation sections
    navigation: {
      main: "Main",
      operations: "Operations",
      management: "Management",
      system: "System"
    },
    
    // Purchases
    purchaseNumber: "Purchase Number",
    supplier: "Supplier",
    branch: "Branch",
    totalAmount: "Total Amount",
    
    // Inventory
    inventoryReport: "Inventory Report",
    salesReport: "Sales Report",
    profitReport: "Profit Report",
    totalProducts: "Total Products",
    totalQuantity: "Total Quantity",
    availableQuantity: "Available Quantity",
    lowStock: "Low Stock",
    
    // Settings
    general: "General Settings",
    security: "Security",
    companyName: "Company Name",
    companyEmail: "Company Email",
    companyPhone: "Company Phone",
    companyAddress: "Company Address",
    currency: "Currency",
    timezone: "Timezone",
    dateFormat: "Date Format",
    saveSettings: "Save Settings",
    sessionTimeout: "Session Timeout (minutes)",
    maxLoginAttempts: "Max Login Attempts",
    preferences: "Preferences",
    settingsSaved: "Settings saved successfully",
    
    // Common keys used in tables
    actions: "Actions",
    created: "Created",
    updated: "Updated",
    items: "Items",
    of: "of",
    page: "Page",
    previous: "Previous",
    next: "Next"
  },
  am: {
    // Common
    appName: "ካት ኢንቬንተሪ",
    search: "ፈልግ",
    welcome: "እንኳን ደህና መጡ",
    profile: "መገለጫ",
    changePassword: "የይለፍ ቃል ቀይር",
    notifications: "ማሳወቂያዎች",
    logout: "ውጣ",
    user: "ተጠቃሚ",
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
    print: "አትም",
    export: "ላክ",
    refresh: "አድስ",
    clear: "አጽዳ",
    upload: "ጫን",
    all: "ሁሉም",
    none: "ምንም",
    or: "ወይም",
    notes: "ማስታወሻዎች",
    contact: "የመገናኛ",
    warning: "ማንቂያ",
    success: "ተሳካ",
    status: "ሁኔታ",
    amount: "መጠን",
    total: "ድምር",
    
    // Navigation
    dashboard: "ዳሽቦርድ",
    inventory: "ኢንቬንተሪ",
    products: "ምርቶች",
    batches: "ባችዎች",
    stockMovements: "የእቃ እንቅስቃሴ",
    sales: "ሽያጭ",
    purchases: "ግዢ",
    transfers: "ዝውውር",
    reports: "ሪፖርቶች",
    customers: "ደንበኞች",
    suppliers: "አቅራቢዎች",
    users: "ተጠቃሚዎች",
    roles: "ሚናዎች እና ፍቃዶች",
    branches: "ቅርንጫፎች",
    settings: "ቅንብሮች",
    auditLogs: "የኦዲት መዝገቦች",
    
    // Navigation sections
    navigation: {
      main: "ዋና",
      operations: "ሥራዎች",
      management: "አስተዳደር",
      system: "ሲስተም"
    },
    
    // Purchases
    purchaseNumber: "የግዢ ቁጥር",
    supplier: "አቅራቢ",
    branch: "ቅርንጫፍ",
    totalAmount: "ጠቅላላ ድምር",
    
    // Inventory
    inventoryReport: "የኢንቬንተሪ ሪፖርት",
    salesReport: "የሽያጭ ሪፖርት",
    profitReport: "የትርፍ ሪፖርት",
    totalProducts: "ጠቅላላ ምርቶች",
    totalQuantity: "ጠቅላላ ብዛት",
    availableQuantity: "ያለ ብዛት",
    lowStock: "ዝቅተኛ ክምችት",
    
    // Settings
    general: "አጠቃላይ ቅንብሮች",
    security: "ደህንነት",
    companyName: "የኩባንያ ስም",
    companyEmail: "የኩባንያ ኢሜይል",
    companyPhone: "የኩባንያ ስልክ",
    companyAddress: "የኩባንያ አድራሻ",
    currency: "ገንዘብ",
    timezone: "የሰዓት ሰቅ",
    dateFormat: "የቀን ቅርጸት",
    saveSettings: "ቅንብሮችን አስቀምጥ",
    sessionTimeout: "የክፍለ ጊዜ ጊዜ ማብቂያ (ደቂቃዎች)",
    maxLoginAttempts: "ከፍተኛ የመግቢያ ሙከራዎች",
    preferences: "ምርጫዎች",
    settingsSaved: "ቅንብሮች በተሳካ ሁኔታ ተቀምጠዋል",
    
    // Common keys used in tables
    actions: "ድርጊቶች",
    created: "ተፈጠረ",
    updated: "ተዘመነ",
    items: "እቃዎች",
    of: "ከ",
    page: "ገጽ",
    previous: "ቀዳሚ",
    next: "ቀጣይ"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    // Direct lookup
    if (translations[language] && translations[language][key] !== undefined) {
      return translations[language][key];
    }
    
    // Try nested lookup
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return fallback;
      }
    }
    return result || key;
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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enCommon from '../locales/en/common.json';
import amCommon from '../locales/am/common.json';

const resources = {
  en: {
    common: enCommon
  },
  am: {
    common: amCommon
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
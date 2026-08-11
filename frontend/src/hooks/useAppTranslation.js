import { useTranslation } from 'react-i18next';

export const useAppTranslation = () => {
  const { t, i18n } = useTranslation('common');

  const translate = (key, options = {}) => {
    return t(key, options);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const getCurrentLanguage = () => {
    return i18n.language || 'en';
  };

  return {
    t: translate,
    changeLanguage,
    currentLanguage: getCurrentLanguage(),
    i18n
  };
};

export default useAppTranslation;
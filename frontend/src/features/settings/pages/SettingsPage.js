import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Settings, Save, RefreshCw, Key, Globe, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { fetchSettings, updateSettings, clearError } from '../slices/settingsSlice';
import { useLanguage } from '../../../context/LanguageContext';

const SettingsPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { settings, isLoading, error } = useSelector((state) => state.settings);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async () => {
    try {
      await dispatch(updateSettings(formData)).unwrap();
      toast.success(t('settings.settingsSaved'));
    } catch (error) {
      toast.error(t('errors.generic'));
    }
  };

  const sections = [
    {
      title: t('settings.general'),
      icon: Settings,
      fields: [
        { key: 'companyName', label: t('settings.companyName'), type: 'text' },
        { key: 'companyEmail', label: t('settings.companyEmail'), type: 'email' },
        { key: 'companyPhone', label: t('settings.companyPhone'), type: 'text' },
        { key: 'companyAddress', label: t('settings.companyAddress'), type: 'text' },
      ]
    },
    {
      title: t('settings.currency'),
      icon: DollarSign,
      fields: [
        { key: 'currency', label: t('settings.currency'), type: 'text' },
        { key: 'timezone', label: t('settings.timezone'), type: 'text' },
        { key: 'dateFormat', label: t('settings.dateFormat'), type: 'text' },
      ]
    },
    {
      title: t('settings.security'),
      icon: Key,
      fields: [
        { key: 'sessionTimeout', label: t('settings.sessionTimeout'), type: 'number' },
        { key: 'maxLoginAttempts', label: t('settings.maxLoginAttempts'), type: 'number' },
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('settings.title')}</p>
        </div>
        <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {t('settings.saveSettings')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
              </div>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <Input
                    key={field.key}
                    label={field.label}
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsPage;



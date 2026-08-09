import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Settings, Save, RefreshCw, Key, Globe, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { fetchSettings, updateSettings, clearError } from '../slices/settingsSlice';

const SettingsPage = () => {
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
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const sections = [
    {
      title: 'General Settings',
      icon: Settings,
      fields: [
        { key: 'companyName', label: 'Company Name', type: 'text' },
        { key: 'companyEmail', label: 'Company Email', type: 'email' },
        { key: 'companyPhone', label: 'Company Phone', type: 'text' },
        { key: 'companyAddress', label: 'Company Address', type: 'text' },
      ]
    },
    {
      title: 'Currency & Locale',
      icon: DollarSign,
      fields: [
        { key: 'currency', label: 'Currency', type: 'text' },
        { key: 'timezone', label: 'Timezone', type: 'text' },
        { key: 'dateFormat', label: 'Date Format', type: 'text' },
      ]
    },
    {
      title: 'Security',
      icon: Key,
      fields: [
        { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'number' },
        { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number' },
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Configure system settings and preferences</p>
        </div>
        <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
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
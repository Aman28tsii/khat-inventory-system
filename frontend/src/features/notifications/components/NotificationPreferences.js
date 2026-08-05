import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Bell, BellOff, Mail, Globe, Smartphone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import { fetchPreferences, updatePreferences } from '../slices/notificationSlice';

const NotificationPreferences = () => {
  const dispatch = useDispatch();
  const { preferences, isLoading } = useSelector((state) => state.notifications);
  const [localPreferences, setLocalPreferences] = useState(null);

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setLocalPreferences({
      ...localPreferences,
      [key]: !localPreferences[key]
    });
  };

  const handleTypeToggle = (type) => {
    setLocalPreferences({
      ...localPreferences,
      types: {
        ...localPreferences.types,
        [type]: !localPreferences.types[type]
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updatePreferences(localPreferences)).unwrap();
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error(error);
    }
  };

  if (!localPreferences) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Channels */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Notification Channels
        </h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In-App</span>
            </div>
            <button
              onClick={() => handleToggle('inApp')}
              className={`w-12 h-6 rounded-full transition-colors ${
                localPreferences.inApp ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                localPreferences.inApp ? 'translate-x-7' : 'translate-x-1'
              } mt-1`} />
            </button>
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
            </div>
            <button
              onClick={() => handleToggle('email')}
              className={`w-12 h-6 rounded-full transition-colors ${
                localPreferences.email ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                localPreferences.email ? 'translate-x-7' : 'translate-x-1'
              } mt-1`} />
            </button>
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</span>
            </div>
            <button
              onClick={() => handleToggle('push')}
              className={`w-12 h-6 rounded-full transition-colors ${
                localPreferences.push ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                localPreferences.push ? 'translate-x-7' : 'translate-x-1'
              } mt-1`} />
            </button>
          </label>
        </div>
      </div>

      {/* Notification Types */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Notification Types
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(localPreferences.types || {}).map(([type, enabled]) => (
            <label
              key={type}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {type}
              </span>
              <button
                onClick={() => handleTypeToggle(type)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${
                  enabled ? 'translate-x-5' : 'translate-x-1'
                } mt-0.5`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="primary"
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
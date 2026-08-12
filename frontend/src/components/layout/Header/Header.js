import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  UserCircle,
  Shield,
  LayoutDashboard
} from 'lucide-react';
import { logout } from '../../../features/auth/slices/authSlice';
import NotificationBell from './NotificationBell.js';
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';
import { useLanguage } from '../../../context/LanguageContext';

const Header = ({ toggleSidebar }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left Section - Menu Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (typeof toggleSidebar === 'function') {
                toggleSidebar();
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Center - Logo/Brand (optional) */}
        <div className="flex-1 flex justify-center md:justify-start">
          <span className="text-lg font-bold text-gray-900 dark:text-white md:hidden">
            🌿 {t('appName') || 'Khat Inventory'}
          </span>
        </div>

        {/* Right Section - Search, Language, Theme, Notifications, User */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search Bar - moved to right */}
          <div className="flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              className="pl-10 pr-4 py-2 w-28 sm:w-40 md:w-48 lg:w-64 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <LanguageSwitcher />
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          <NotificationBell />
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🌿 {t('welcome')}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {user?.role?.name || t('user')}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                      {t('profile')}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/change-password');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      {t('changePassword')}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/notifications');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      {t('notifications.title')}
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Truck, FileText, Settings, 
  LogOut, X, Warehouse, TrendingUp, CreditCard, Bell, Shield, Building2,
  ClipboardList, BarChart3, UserCog, Store, Calculator, AlertCircle
} from 'lucide-react';
import { logout } from '../../../features/auth/slices/authSlice';
import { useLanguage } from '../../../context/LanguageContext';s

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      section: t('navigation.main') || 'ዋና',
      items: [
        { path: '/dashboard', icon: LayoutDashboard, label: t('dashboard') || 'ዳሽቦርድ' },
      ]
    },
    {
      section: t('inventory') || 'ኢንቬንተሪ',
      items: [
        { path: '/products', icon: Package, label: t('products') || 'ምርቶች' },
        { path: '/batches', icon: ClipboardList, label: t('batches') || 'ባችዎች' },
        { path: '/inventory/stock-movements', icon: TrendingUp, label: t('stockMovements') || 'የእቃ እንቅስቃሴ' },
      ]
    },
    {
      section: t('navigation.operations') || 'ሥራዎች',
      items: [
        { path: '/purchases', icon: Truck, label: t('purchases') || 'ግዢ' },
        { path: '/sales', icon: ShoppingCart, label: t('sales') || 'ሽያጭ' },
        { path: '/transfers', icon: Store, label: t('transfers') || 'ዝውውር' },
      ]
    },
    {
      section: t('navigation.management') || 'አስተዳደር',
      items: [
        { path: '/users', icon: Users, label: t('users') || 'ተጠቃሚዎች' },
        { path: '/roles', icon: Shield, label: t('roles') || 'ሚናዎች እና ፍቃዶች' },
        { path: '/branches', icon: Building2, label: t('branches') || 'ቅርንጫፎች' },
        { path: '/suppliers', icon: Truck, label: t('suppliers') || 'አቅራቢዎች' },
        { path: '/customers', icon: Users, label: t('customers') || 'ደንበኞች' },
      ]
    },
    {
      section: t('reports') || 'ሪፖርቶች',
      items: [
        { path: '/reports/inventory', icon: BarChart3, label: t('inventoryReport') || 'የኢንቬንተሪ ሪፖርት' },
        { path: '/reports/sales', icon: Calculator, label: t('salesReport') || 'የሽያጭ ሪፖርት' },
        { path: '/reports/profit', icon: TrendingUp, label: t('profitReport') || 'የትርፍ ሪፖርት' },
      ]
    },
    {
      section: t('navigation.system') || 'ሲስተም',
      items: [
        { path: '/notifications', icon: Bell, label: t('notifications') || 'ማሳወቂያዎች' },
        { path: '/audit-logs', icon: ClipboardList, label: t('auditLogs') || 'የኦዲት መዝገቦች' },
        { path: '/settings', icon: Settings, label: t('settings') || 'ቅንብሮች' },
      ]
    }
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 overflow-y-auto shadow-xl"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white block">
                🌿 {t('appName') || 'Khat Inventory'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                v1.0.0
              </span>
            </div>
          </div>
          {isMobile && (
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role?.name || t('user') || 'ተጠቃሚ'}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-6">
          {menuItems.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">{t('logout') || 'ውጣ'}</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;

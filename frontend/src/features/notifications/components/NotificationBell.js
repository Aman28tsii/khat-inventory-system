import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';
import { fetchUnreadCount } from '../slices/notificationSlice';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
      >
        {unreadCount > 0 ? (
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        )}
        
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <NotificationDropdown onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;


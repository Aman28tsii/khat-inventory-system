import React from 'react';
import { Bell } from 'lucide-react';

const NotificationBell = () => {
  return (
    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>
  );
};

export default NotificationBell;



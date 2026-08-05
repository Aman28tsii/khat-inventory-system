import React from 'react';
import { motion } from 'framer-motion';
import Button from '../Button/Button';

const EmptyState = ({
  icon: Icon,
  title = 'No Data Available',
  description = 'There are no items to display at this moment.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      {Icon && (
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1 text-center max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} className="mt-4">
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
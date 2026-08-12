import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || Icon) && (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {Icon && (
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </motion.div>
  );
};

export default Card;


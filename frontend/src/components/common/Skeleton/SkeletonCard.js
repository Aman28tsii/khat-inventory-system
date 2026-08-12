import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;

import React from 'react';

const SkeletonTable = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              {[...Array(columns)].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(rows)].map((_, i) => (
              <tr key={i}>
                {[...Array(columns)].map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTable;

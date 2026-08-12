import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colors = {
    primary: 'border-primary-600',
    white: 'border-white'
  };

  const sizeClass = sizes[size] || sizes.md;
  const colorClass = colors[color] || colors.primary;

  return (
    <div className="flex items-center justify-center">
      <div className={sizeClass + ' border-4 ' + colorClass + ' border-t-transparent rounded-full animate-spin'} />
    </div>
  );
};

export default LoadingSpinner;


import React from 'react';
import { useFormContext } from 'react-hook-form';

const TextArea = ({
  name,
  label,
  placeholder,
  rows = 3,
  required = false,
  className = '',
  ...props
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600'
        } ${className}`}
        placeholder={placeholder}
        {...register(name)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
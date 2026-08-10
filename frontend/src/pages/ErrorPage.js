import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ status = 404, message = 'Page not found' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white">{status}</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">{message}</p>
      <Link
        to="/dashboard"
        className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default ErrorPage;

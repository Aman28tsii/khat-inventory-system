import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../components/layout/AppLayout/AppLayout';

const PrivateRoute = ({ requiredPermissions = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const userPermissions = user?.permissions?.map(p => `${p.resource}:${p.action}`) || [];
    const hasAllPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <AppLayout />;
};

export default PrivateRoute;


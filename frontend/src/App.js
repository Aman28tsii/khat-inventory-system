import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { getCurrentUser } from './features/auth/slices/authSlice';
import { initializeSocket, disconnectSocket } from './services/socketService';

function App() {
  const dispatch = useDispatch();
  // Add safe access with fallback
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth || { isAuthenticated: false, accessToken: null });

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      dispatch(getCurrentUser());
      initializeSocket(accessToken);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [dispatch, isAuthenticated, accessToken]);

  return <AppRoutes />;
}

export default App;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { getCurrentUser } from './features/auth/slices/authSlice';
import { initializeSocket, disconnectSocket } from './services/socketService';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      // Get current user data
      dispatch(getCurrentUser());
      
      // Initialize Socket.IO connection
      initializeSocket(accessToken);
    } else {
      // Disconnect socket when not authenticated
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [dispatch, isAuthenticated, accessToken]);

  return <AppRoutes />;
}

export default App;
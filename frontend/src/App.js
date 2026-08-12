import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { getCurrentUser } from './features/auth/slices/authSlice';
import { initializeSocket, disconnectSocket } from './services/socketService';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      dispatch(getCurrentUser());
      initializeSocket(accessToken);
    } else {
      disconnectSocket();
    }
  }, [dispatch, isAuthenticated, accessToken]);

  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}

export default App;




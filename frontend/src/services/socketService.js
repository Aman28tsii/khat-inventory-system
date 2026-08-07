import { io } from 'socket.io-client';

let socket = null;
let storeInstance = null;

export const initializeSocket = (token) => {
  if (socket) {
    disconnectSocket();
  }

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Listen for notifications - dispatch will be handled by the component
  socket.on('notification:new', (notification) => {
    // This will be handled by the notification slice
    console.log('New notification:', notification);
  });

  return socket;
};

export const setStore = (store) => {
  storeInstance = store;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
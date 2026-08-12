import { io } from 'socket.io-client';

let socket = null;
let eventHandlers = {};

export const initializeSocket = (token) => {
  if (socket) {
    disconnectSocket();
  }

  // Hardcoded Render URL
  const SOCKET_URL = 'https://khat-inventory-system.onrender.com';

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

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const onSocketEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
    eventHandlers[event] = callback;
  }
};

export const offSocketEvent = (event) => {
  if (socket && eventHandlers[event]) {
    socket.off(event, eventHandlers[event]);
    delete eventHandlers[event];
  }
};


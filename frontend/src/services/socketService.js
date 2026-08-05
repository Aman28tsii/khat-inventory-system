import { io } from 'socket.io-client';
import { store } from '../app/store';
import { addNotification, updateUnreadCount } from '../features/notifications/slices/notificationSlice';

let socket = null;

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

  // Connection events
  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Listen for new notifications
  socket.on('notification:new', (notification) => {
    store.dispatch(addNotification(notification));
    // Play sound if enabled
    playNotificationSound();
  });

  // Listen for notification read updates
  socket.on('notification:read', (notificationId) => {
    store.dispatch(realtimeMarkAsRead(notificationId));
  });

  // Listen for unread count updates
  socket.on('notification:unread-update', (count) => {
    store.dispatch(updateUnreadCount(count));
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

const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Silently fail if audio can't play
    });
  } catch (error) {
    // Silently fail
  }
};
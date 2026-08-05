import { useEffect, useState } from 'react';
import { getSocket } from '../services/socketService';

export const useSocket = (eventName, handler) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    if (socketInstance && eventName && handler) {
      socketInstance.on(eventName, handler);
      return () => {
        socketInstance.off(eventName, handler);
      };
    }
  }, [eventName, handler]);

  return socket;
};
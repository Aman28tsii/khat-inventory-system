import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import notificationService from '../services/notificationService.js';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
          role: true,
        },
      });

      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      socket.userId = user.id;
      socket.branchId = user.branchId;
      socket.role = user.role.name;
      next();
    } catch (error) {
      return next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} - User: ${socket.userId}`);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Join branch-specific room if user has a branch
    if (socket.branchId) {
      socket.join(`branch:${socket.branchId}`);
    }

    // Join role-specific room
    if (socket.role) {
      socket.join(`role:${socket.role}`);
    }

    // Send connection confirmation
    socket.emit('connected', {
      userId: socket.userId,
      branchId: socket.branchId,
      role: socket.role,
    });

    // Set up event handlers
    setupSocketEvents(socket);

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id} - User: ${socket.userId}`);
    });
  });

  return io;
};

const setupSocketEvents = (socket) => {
  // Mark notification as read
  socket.on('notification:markRead', async (notificationId) => {
    try {
      const notification = await prisma.notification.update({
        where: { id: notificationId, userId: socket.userId },
        data: { isRead: true },
      });

      // Emit updated unread count
      const unreadCount = await prisma.notification.count({
        where: { userId: socket.userId, isRead: false },
      });

      io.to(`user:${socket.userId}`).emit('notification:unread-update', unreadCount);
      io.to(`user:${socket.userId}`).emit('notification:read', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  });

  // Mark all notifications as read
  socket.on('notification:markAllRead', async () => {
    try {
      await prisma.notification.updateMany({
        where: { userId: socket.userId, isRead: false },
        data: { isRead: true },
      });

      io.to(`user:${socket.userId}`).emit('notification:unread-update', 0);
      io.to(`user:${socket.userId}`).emit('notification:all-read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  });

  // Join dashboard updates
  socket.on('dashboard:join', () => {
    socket.join('dashboard:updates');
    socket.emit('dashboard:joined', { success: true });
  });

  // Leave dashboard updates
  socket.on('dashboard:leave', () => {
    socket.leave('dashboard:updates');
    socket.emit('dashboard:left', { success: true });
  });

  // Request inventory update for branch
  socket.on('inventory:request', async (data) => {
    try {
      const { branchId } = data;
      const inventory = await prisma.inventory.findMany({
        where: { branchId },
        include: {
          batch: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });

      socket.emit('inventory:update', {
        branchId,
        data: inventory,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  });

  // Request sales update
  socket.on('sales:request', async (data) => {
    try {
      const { branchId, limit = 20 } = data || {};
      const where = {};
      if (branchId) {
        where.branchId = branchId;
      }

      const sales = await prisma.sale.findMany({
        where,
        include: {
          customer: true,
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      socket.emit('sales:update', {
        branchId,
        data: sales,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  });

  // Request notifications
  socket.on('notification:request', async (data) => {
    try {
      const { limit = 20, offset = 0 } = data || {};
      const notifications = await prisma.notification.findMany({
        where: { userId: socket.userId },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const unreadCount = await prisma.notification.count({
        where: { userId: socket.userId, isRead: false },
      });

      socket.emit('notification:list', {
        data: notifications,
        unreadCount,
        total: await prisma.notification.count({
          where: { userId: socket.userId },
        }),
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  });

  // Alert for stock movement
  socket.on('stock:watch', (data) => {
    const { productId } = data;
    if (productId) {
      socket.join(`stock:${productId}`);
    } else {
      socket.join('stock:all');
    }
    socket.emit('stock:watched', { success: true });
  });

  // Stop watching stock
  socket.on('stock:unwatch', (data) => {
    const { productId } = data;
    if (productId) {
      socket.leave(`stock:${productId}`);
    } else {
      socket.leave('stock:all');
    }
    socket.emit('stock:unwatched', { success: true });
  });
};

// Emit functions for use in other services
export const emitNotification = (userId, notification) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification:new', notification);
  io.to(`user:${userId}`).emit('notification:unread-update', 
    prisma.notification.count({
      where: { userId, isRead: false },
    }).catch(() => 0)
  );
};

export const emitInventoryUpdate = (branchId, data) => {
  if (!io) return;
  io.to(`branch:${branchId}`).emit('inventory:update', {
    branchId,
    data,
    timestamp: new Date().toISOString(),
  });
  io.to('dashboard:updates').emit('inventory:global', {
    branchId,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const emitStockMovement = (branchId, movement) => {
  if (!io) return;
  io.to(`branch:${branchId}`).emit('stock:movement', movement);
  io.to('dashboard:updates').emit('stock:global', movement);
};

export const emitSaleUpdate = (branchId, sale) => {
  if (!io) return;
  io.to(`branch:${branchId}`).emit('sales:new', sale);
  io.to('dashboard:updates').emit('sales:global', sale);
};

export const emitDashboardUpdate = (data) => {
  if (!io) return;
  io.to('dashboard:updates').emit('dashboard:update', data);
};

export const emitAlert = (data) => {
  if (!io) return;
  io.to('dashboard:updates').emit('alert:new', data);
  // Also send to users with manager role
  io.to('role:MANAGER').emit('alert:new', data);
  io.to('role:ADMIN').emit('alert:new', data);
  io.to('role:SUPER_ADMIN').emit('alert:new', data);
};

export const getIO = () => io;
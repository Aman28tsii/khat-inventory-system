import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../services/notificationService';

const initialState = {
  notifications: [],
  unreadCount: 0,
  preferences: {
    email: true,
    push: true,
    inApp: true,
    types: {
      inventory: true,
      sales: true,
      purchases: true,
      transfers: true,
      users: true,
      system: true
    }
  },
  isLoading: false,
  error: null,
  total: 0
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await notificationService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getUnreadCount();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAsRead(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAllAsRead();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

export const deleteAllNotifications = createAsyncThunk(
  'notifications/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.deleteAll();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete all notifications');
    }
  }
);

export const fetchPreferences = createAsyncThunk(
  'notifications/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getPreferences();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch preferences');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async (data, { rejectWithValue }) => {
    try {
      const response = await notificationService.updatePreferences(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.total += 1;
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    realtimeMarkAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.data;
        state.total = action.payload.total || action.payload.data.length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.total = 0;
        state.unreadCount = 0;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  }
});

export const { 
  addNotification, 
  clearError, 
  updateUnreadCount,
  realtimeMarkAsRead 
} = notificationSlice.actions;

export default notificationSlice.reducer;

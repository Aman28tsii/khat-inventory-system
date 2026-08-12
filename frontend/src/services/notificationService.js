import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  total: 0,
  preferences: {
    email: true,
    push: true,
    inApp: true
  }
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/notifications/unread-count');
      if (!response.ok) throw new Error('Failed to fetch unread count');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/notifications/read-all', {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark all as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.total += 1;
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
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
        state.notifications = action.payload.data || [];
        state.total = action.payload.total || 0;
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
      });
  }
});

export const { 
  clearError, 
  updateUnreadCount, 
  addNotification, 
  realtimeMarkAsRead 
} = notificationSlice.actions;

export default notificationSlice.reducer;


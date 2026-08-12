import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

const initialState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10
};

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'users/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get current user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/users', data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(/users/, data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(/users/);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(/users//status);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ id, roleId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(/users//role, { roleId });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'users/resetPassword',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(/users//reset-password);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data || action.payload || [];
        state.total = action.payload.total || state.users.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
        state.total -= 1;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  }
});

export const { setSelectedUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;



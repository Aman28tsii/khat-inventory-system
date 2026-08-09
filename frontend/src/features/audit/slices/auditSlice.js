import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

const initialState = {
  logs: [],
  selectedLog: null,
  resources: [],
  actions: [],
  isLoading: false,
  error: null,
  total: 0
};

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/audit-logs', { params });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }
);

export const fetchAuditLogById = createAsyncThunk(
  'audit/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(/audit-logs/);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit log');
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setSelectedLog: (state, action) => {
      state.selectedLog = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLogs: (state) => {
      state.logs = [];
      state.total = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload.data || action.payload || [];
        state.total = action.payload.total || state.logs.length;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAuditLogById.fulfilled, (state, action) => {
        state.selectedLog = action.payload;
      })
      .addCase(fetchAuditLogById.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { setSelectedLog, clearError, clearLogs } = auditSlice.actions;
export default auditSlice.reducer;

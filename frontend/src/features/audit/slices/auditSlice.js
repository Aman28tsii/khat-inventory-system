import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  logs: [],
  selectedLog: null,
  resources: [],
  actions: [],
  isLoading: false,
  exporting: false,
  error: null,
  total: 0
};

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/audit-logs');
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch audit logs');
    }
  }
);

export const fetchAuditLogById = createAsyncThunk(
  'audit/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/audit-logs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch audit log');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch audit log');
    }
  }
);

export const fetchResources = createAsyncThunk(
  'audit/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/audit-logs/resources');
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch resources');
    }
  }
);

export const fetchActions = createAsyncThunk(
  'audit/fetchActions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/audit-logs/actions');
      if (!response.ok) throw new Error('Failed to fetch actions');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch actions');
    }
  }
);

export const exportAuditLogs = createAsyncThunk(
  'audit/export',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/audit-logs/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error('Failed to export audit logs');
      const blob = await response.blob();
      return blob;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to export audit logs');
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
        state.logs = action.payload.data || [];
        state.total = action.payload.total || 0;
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
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.resources = action.payload;
      })
      .addCase(fetchActions.fulfilled, (state, action) => {
        state.actions = action.payload;
      })
      .addCase(exportAuditLogs.pending, (state) => {
        state.exporting = true;
      })
      .addCase(exportAuditLogs.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportAuditLogs.rejected, (state) => {
        state.exporting = false;
      });
  }
});

export const { setSelectedLog, clearError, clearLogs } = auditSlice.actions;
export default auditSlice.reducer;
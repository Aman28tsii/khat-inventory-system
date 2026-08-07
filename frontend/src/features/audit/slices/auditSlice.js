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

// Mock data for now - replace with actual API calls
export const fetchAuditLogs = createAsyncThunk(
  'audit/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Mock response - replace with actual API call
      const mockData = [
        {
          id: '1',
          user: { firstName: 'System', lastName: 'Admin', email: 'admin@khattrading.com' },
          action: 'LOGIN',
          resourceType: 'USER',
          resourceId: 'user-123',
          changes: { success: true },
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome/120.0.0.0',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          user: { firstName: 'John', lastName: 'Doe', email: 'john@khattrading.com' },
          action: 'CREATE',
          resourceType: 'SALE',
          resourceId: 'sale-456',
          changes: { amount: 500, customer: 'Jane Smith' },
          ipAddress: '192.168.1.2',
          userAgent: 'Firefox/121.0',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      return { data: mockData, total: mockData.length };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch audit logs');
    }
  }
);

export const fetchAuditLogById = createAsyncThunk(
  'audit/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      // Mock response
      const mockLog = {
        id: id,
        user: { firstName: 'System', lastName: 'Admin', email: 'admin@khattrading.com' },
        action: 'LOGIN',
        resourceType: 'USER',
        resourceId: 'user-123',
        changes: { success: true, timestamp: new Date().toISOString() },
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0.0.0',
        createdAt: new Date().toISOString()
      };
      return mockLog;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch audit log');
    }
  }
);

export const fetchResources = createAsyncThunk(
  'audit/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      return ['USER', 'ROLE', 'BRANCH', 'PRODUCT', 'INVENTORY', 'SALE', 'PURCHASE', 'TRANSFER'];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch resources');
    }
  }
);

export const fetchActions = createAsyncThunk(
  'audit/fetchActions',
  async (_, { rejectWithValue }) => {
    try {
      return ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT'];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch actions');
    }
  }
);

export const exportAuditLogs = createAsyncThunk(
  'audit/export',
  async (params, { rejectWithValue }) => {
    try {
      // Mock export - returns blob
      const blob = new Blob(['Mock audit logs data'], { type: 'application/pdf' });
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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../services/dashboardService';

const initialState = {
  executive: null,
  warehouse: null,
  branch: null,
  inventoryManager: null,
  accountant: null,
  cashier: null,
  recentActivities: [],
  alerts: [],
  isLoading: false,
  error: null
};

export const fetchExecutiveDashboard = createAsyncThunk(
  'dashboard/fetchExecutive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getExecutive();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getRecentActivities();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
    }
  }
);

export const fetchAlerts = createAsyncThunk(
  'dashboard/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getAlerts();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExecutiveDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExecutiveDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.executive = action.payload;
      })
      .addCase(fetchExecutiveDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.recentActivities = action.payload;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      });
  }
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;



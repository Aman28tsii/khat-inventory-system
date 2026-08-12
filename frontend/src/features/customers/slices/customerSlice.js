import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

const initialState = {
  customers: [],
  selectedCustomer: null,
  creditHistory: [],
  isLoading: false,
  error: null,
  total: 0
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/customers', { params });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/customers', data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(/customers/, data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(/customers/);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete customer');
    }
  }
);

export const toggleCustomerStatus = createAsyncThunk(
  'customers/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(/customers//status);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
    }
  }
);

export const fetchCreditHistory = createAsyncThunk(
  'customers/creditHistory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(/customers//credit-history);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credit history');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCreditHistory: (state) => {
      state.creditHistory = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.data || action.payload || [];
        state.total = action.payload.total || state.customers.length;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(c => c.id !== action.payload);
        state.total -= 1;
      })
      .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(fetchCreditHistory.fulfilled, (state, action) => {
        state.creditHistory = action.payload;
      });
  }
});

export const { setSelectedCustomer, clearError, clearCreditHistory } = customerSlice.actions;
export default customerSlice.reducer;


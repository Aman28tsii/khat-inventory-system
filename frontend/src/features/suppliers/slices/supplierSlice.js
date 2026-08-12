import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

const initialState = {
  suppliers: [],
  selectedSupplier: null,
  isLoading: false,
  error: null,
  total: 0
};

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/suppliers', { params });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suppliers');
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/suppliers', data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create supplier');
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(/suppliers/, data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update supplier');
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(/suppliers/);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete supplier');
    }
  }
);

export const toggleSupplierStatus = createAsyncThunk(
  'suppliers/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(/suppliers//status);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
    }
  }
);

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedSupplier: (state, action) => {
      state.selectedSupplier = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload.data || action.payload || [];
        state.total = action.payload.total || state.suppliers.length;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
        state.total -= 1;
      })
      .addCase(toggleSupplierStatus.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      });
  }
});

export const { clearError, setSelectedSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

const initialState = {
  products: [],
  batches: [],
  movements: [],
  selectedProduct: null,
  selectedBatch: null,
  isLoading: false,
  error: null,
  total: 0
};

// Product actions
export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'inventory/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/products', data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'inventory/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(/products/, data);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'inventory/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(/products/);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Batch actions
export const fetchBatches = createAsyncThunk(
  'inventory/fetchBatches',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/batches', { params });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch batches');
    }
  }
);

// Stock Movement actions
export const fetchStockMovements = createAsyncThunk(
  'inventory/fetchStockMovements',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/inventory/movements', { params });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stock movements');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSelectedBatch: (state, action) => {
      state.selectedBatch = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || action.payload || [];
        state.total = action.payload.total || state.products.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      // Batches
      .addCase(fetchBatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.batches = action.payload.data || action.payload || [];
        state.total = action.payload.total || state.batches.length;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Stock Movements
      .addCase(fetchStockMovements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movements = action.payload.data || action.payload || [];
        state.total = action.payload.total || state.movements.length;
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedProduct, setSelectedBatch } = inventorySlice.actions;
export default inventorySlice.reducer;


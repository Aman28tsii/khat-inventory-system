import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saleService } from '../services/saleService';

const initialState = {
  sales: [],
  selectedSale: null,
  payments: [],
  availableBatches: [],
  isLoading: false,
  error: null,
  total: 0
};

export const fetchSales = createAsyncThunk(
  'sales/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await saleService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales');
    }
  }
);

export const fetchSaleById = createAsyncThunk(
  'sales/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await saleService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sale');
    }
  }
);

export const createSale = createAsyncThunk(
  'sales/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await saleService.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create sale');
    }
  }
);

export const updateSale = createAsyncThunk(
  'sales/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await saleService.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update sale');
    }
  }
);

export const deleteSale = createAsyncThunk(
  'sales/delete',
  async (id, { rejectWithValue }) => {
    try {
      await saleService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete sale');
    }
  }
);

export const processPayment = createAsyncThunk(
  'sales/processPayment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await saleService.processPayment(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process payment');
    }
  }
);

export const fetchPayments = createAsyncThunk(
  'sales/fetchPayments',
  async (id, { rejectWithValue }) => {
    try {
      const response = await saleService.getPayments(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const returnSale = createAsyncThunk(
  'sales/return',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await saleService.returnSale(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process return');
    }
  }
);

export const fetchAvailableBatches = createAsyncThunk(
  'sales/fetchAvailableBatches',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await saleService.getAvailableBatches(productId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch batches');
    }
  }
);

const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSelectedSale: (state, action) => {
      state.selectedSale = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearPayments: (state) => {
      state.payments = [];
    },
    clearBatches: (state) => {
      state.availableBatches = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = action.payload.data;
        state.total = action.payload.total || action.payload.data.length;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.selectedSale = action.payload;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.sales.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        const index = state.sales.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.selectedSale?.id === action.payload.id) {
          state.selectedSale = action.payload;
        }
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.sales = state.sales.filter(s => s.id !== action.payload);
        state.total -= 1;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        const index = state.sales.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.selectedSale?.id === action.payload.id) {
          state.selectedSale = action.payload;
        }
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
      })
      .addCase(fetchAvailableBatches.fulfilled, (state, action) => {
        state.availableBatches = action.payload;
      })
      .addCase(returnSale.fulfilled, (state, action) => {
        const index = state.sales.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
        if (state.selectedSale?.id === action.payload.id) {
          state.selectedSale = action.payload;
        }
      });
  }
});

export const { 
  setSelectedSale, 
  clearError, 
  clearPayments,
  clearBatches 
} = saleSlice.actions;

export default saleSlice.reducer;


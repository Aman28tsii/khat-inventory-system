import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { purchaseService } from '../services/purchaseService';

const initialState = {
  purchases: [],
  selectedPurchase: null,
  items: [],
  isLoading: false,
  error: null,
  total: 0
};

export const fetchPurchases = createAsyncThunk(
  'purchases/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await purchaseService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch purchases');
    }
  }
);

export const fetchPurchaseById = createAsyncThunk(
  'purchases/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch purchase');
    }
  }
);

export const createPurchase = createAsyncThunk(
  'purchases/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await purchaseService.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create purchase');
    }
  }
);

export const updatePurchase = createAsyncThunk(
  'purchases/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await purchaseService.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update purchase');
    }
  }
);

export const deletePurchase = createAsyncThunk(
  'purchases/delete',
  async (id, { rejectWithValue }) => {
    try {
      await purchaseService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete purchase');
    }
  }
);

export const receivePurchase = createAsyncThunk(
  'purchases/receive',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await purchaseService.receive(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to receive purchase');
    }
  }
);

export const approvePurchase = createAsyncThunk(
  'purchases/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.approve(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve purchase');
    }
  }
);

export const fetchPurchaseItems = createAsyncThunk(
  'purchases/fetchItems',
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.getItems(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
    }
  }
);

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setSelectedPurchase: (state, action) => {
      state.selectedPurchase = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearItems: (state) => {
      state.items = [];
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchases = action.payload.data;
        state.total = action.payload.total || action.payload.data.length;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.selectedPurchase = action.payload;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.purchases.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        if (state.selectedPurchase?.id === action.payload.id) {
          state.selectedPurchase = action.payload;
        }
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(p => p.id !== action.payload);
        state.total -= 1;
      })
      .addCase(receivePurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        if (state.selectedPurchase?.id === action.payload.id) {
          state.selectedPurchase = action.payload;
        }
      })
      .addCase(approvePurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        if (state.selectedPurchase?.id === action.payload.id) {
          state.selectedPurchase = action.payload;
        }
      })
      .addCase(fetchPurchaseItems.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export const { 
  setSelectedPurchase, 
  clearError, 
  clearItems, 
  addItem, 
  removeItem,
  updateItemQuantity 
} = purchaseSlice.actions;

export default purchaseSlice.reducer;



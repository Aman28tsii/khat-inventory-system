import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transferService } from '../services/transferService';

const initialState = {
  transfers: [],
  selectedTransfer: null,
  items: [],
  availableBatches: [],
  isLoading: false,
  error: null,
  total: 0
};

export const fetchTransfers = createAsyncThunk(
  'transfers/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await transferService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transfers');
    }
  }
);

export const fetchTransferById = createAsyncThunk(
  'transfers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await transferService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transfer');
    }
  }
);

export const createTransfer = createAsyncThunk(
  'transfers/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await transferService.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transfer');
    }
  }
);

export const approveTransfer = createAsyncThunk(
  'transfers/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await transferService.approve(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve transfer');
    }
  }
);

export const rejectTransfer = createAsyncThunk(
  'transfers/reject',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await transferService.reject(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject transfer');
    }
  }
);

export const receiveTransfer = createAsyncThunk(
  'transfers/receive',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await transferService.receive(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to receive transfer');
    }
  }
);

export const fetchTransferItems = createAsyncThunk(
  'transfers/fetchItems',
  async (id, { rejectWithValue }) => {
    try {
      const response = await transferService.getItems(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
    }
  }
);

export const fetchAvailableBatches = createAsyncThunk(
  'transfers/fetchAvailableBatches',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await transferService.getAvailableBatches(branchId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch batches');
    }
  }
);

const transferSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    setSelectedTransfer: (state, action) => {
      state.selectedTransfer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearItems: (state) => {
      state.items = [];
    },
    clearBatches: (state) => {
      state.availableBatches = [];
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransfers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransfers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transfers = action.payload.data;
        state.total = action.payload.total || action.payload.data.length;
      })
      .addCase(fetchTransfers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTransferById.fulfilled, (state, action) => {
        state.selectedTransfer = action.payload;
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.transfers.unshift(action.payload);
        state.total += 1;
      })
      .addCase(approveTransfer.fulfilled, (state, action) => {
        const index = state.transfers.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transfers[index] = action.payload;
        }
        if (state.selectedTransfer?.id === action.payload.id) {
          state.selectedTransfer = action.payload;
        }
      })
      .addCase(rejectTransfer.fulfilled, (state, action) => {
        const index = state.transfers.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transfers[index] = action.payload;
        }
        if (state.selectedTransfer?.id === action.payload.id) {
          state.selectedTransfer = action.payload;
        }
      })
      .addCase(receiveTransfer.fulfilled, (state, action) => {
        const index = state.transfers.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transfers[index] = action.payload;
        }
        if (state.selectedTransfer?.id === action.payload.id) {
          state.selectedTransfer = action.payload;
        }
      })
      .addCase(fetchTransferItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchAvailableBatches.fulfilled, (state, action) => {
        state.availableBatches = action.payload;
      });
  }
});

export const { 
  setSelectedTransfer, 
  clearError, 
  clearItems,
  clearBatches,
  addItem,
  removeItem
} = transferSlice.actions;

export default transferSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { branchService } from '../services/branchService';

const initialState = {
  branches: [],
  selectedBranch: null,
  isLoading: false,
  error: null
};

export const fetchBranches = createAsyncThunk(
  'branches/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await branchService.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branches');
    }
  }
);

export const createBranch = createAsyncThunk(
  'branches/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await branchService.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create branch');
    }
  }
);

export const updateBranch = createAsyncThunk(
  'branches/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await branchService.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update branch');
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branches/delete',
  async (id, { rejectWithValue }) => {
    try {
      await branchService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete branch');
    }
  }
);

export const toggleBranchStatus = createAsyncThunk(
  'branches/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await branchService.toggleStatus(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
    }
  }
);

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.branches.push(action.payload);
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        const index = state.branches.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.branches = state.branches.filter(b => b.id !== action.payload);
      })
      .addCase(toggleBranchStatus.fulfilled, (state, action) => {
        const index = state.branches.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      });
  }
});

export const { setSelectedBranch, clearError } = branchesSlice.actions;
export default branchesSlice.reducer;

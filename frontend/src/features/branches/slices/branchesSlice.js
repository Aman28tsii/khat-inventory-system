import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
      const response = await fetch('/api/v1/branches');
      if (!response.ok) throw new Error('Failed to fetch branches');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch branches');
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branches/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/branches/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete branch');
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete branch');
    }
  }
);

// Add toggleBranchStatus
export const toggleBranchStatus = createAsyncThunk(
  'branches/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/branches/${id}/status`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to toggle branch status');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle branch status');
    }
  }
);

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
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
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.branches = state.branches.filter(branch => branch.id !== action.payload);
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleBranchStatus.fulfilled, (state, action) => {
        const index = state.branches.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(toggleBranchStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedBranch } = branchesSlice.actions;
export default branchesSlice.reducer;
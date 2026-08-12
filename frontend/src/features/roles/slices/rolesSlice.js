import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  roles: [],
  selectedRole: null,
  isLoading: false,
  error: null
};

export const fetchRoles = createAsyncThunk(
  'roles/fetch',
  async (_, { rejectWithValue }) => {
    try {
      // Mock data for now
      return [
        { id: '1', name: 'SUPER_ADMIN', description: 'Full system access', level: 100, isSystem: true },
        { id: '2', name: 'ADMIN', description: 'Administrative access', level: 90, isSystem: true },
        { id: '3', name: 'MANAGER', description: 'Branch manager', level: 70, isSystem: true },
        { id: '4', name: 'INVENTORY_MANAGER', description: 'Inventory management', level: 60, isSystem: true },
        { id: '5', name: 'CASHIER', description: 'Point of sale operations', level: 30, isSystem: true },
        { id: '6', name: 'VIEWER', description: 'Read-only access', level: 10, isSystem: true },
      ];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch roles');
    }
  }
);

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setSelectedRole } = rolesSlice.actions;
export default rolesSlice.reducer;


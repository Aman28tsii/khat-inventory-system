import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  customers: [
    { id: '1', name: 'John Doe', code: 'CUST-001', phone: '+251-911-1234', email: 'john@example.com', address: 'Addis Ababa', isActive: true },
    { id: '2', name: 'Jane Smith', code: 'CUST-002', phone: '+251-922-5678', email: 'jane@example.com', address: 'Addis Ababa', isActive: true },
    { id: '3', name: 'ABC Trading', code: 'CUST-003', phone: '+251-933-9012', email: 'info@abctrading.com', address: 'Addis Ababa', isActive: true },
  ],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  total: 3
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Try to fetch from API
      const response = await fetch('/api/v1/customers');
      if (!response.ok) throw new Error('API not available');
      const data = await response.json();
      return data;
    } catch (error) {
      // Return mock data if API fails
      return { data: initialState.customers, total: initialState.customers.length };
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
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
        state.customers = action.payload.data || initialState.customers;
        state.total = action.payload.total || initialState.customers.length;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Use mock data on error
        state.customers = initialState.customers;
        state.total = initialState.customers.length;
      });
  }
});

export const { clearError, setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;

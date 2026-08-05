import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportService } from '../services/reportService';

const initialState = {
  inventoryReport: null,
  salesReport: null,
  profitReport: null,
  branchReport: null,
  supplierReport: null,
  isLoading: false,
  error: null,
  exporting: false
};

export const fetchInventoryReport = createAsyncThunk(
  'reports/fetchInventory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportService.getInventoryReport(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory report');
    }
  }
);

export const fetchSalesReport = createAsyncThunk(
  'reports/fetchSales',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportService.getSalesReport(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales report');
    }
  }
);

export const fetchProfitReport = createAsyncThunk(
  'reports/fetchProfit',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportService.getProfitReport(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profit report');
    }
  }
);

export const fetchBranchReport = createAsyncThunk(
  'reports/fetchBranch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportService.getBranchReport(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch report');
    }
  }
);

export const exportReportPDF = createAsyncThunk(
  'reports/exportPDF',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reportService.exportPDF(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export PDF');
    }
  }
);

export const exportReportExcel = createAsyncThunk(
  'reports/exportExcel',
  async (data, { rejectWithValue }) => {
    try {
      const response = await reportService.exportExcel(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export Excel');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReports: (state) => {
      state.inventoryReport = null;
      state.salesReport = null;
      state.profitReport = null;
      state.branchReport = null;
      state.supplierReport = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inventoryReport = action.payload;
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.salesReport = action.payload;
      })
      .addCase(fetchProfitReport.fulfilled, (state, action) => {
        state.profitReport = action.payload;
      })
      .addCase(fetchBranchReport.fulfilled, (state, action) => {
        state.branchReport = action.payload;
      })
      .addCase(exportReportPDF.pending, (state) => {
        state.exporting = true;
      })
      .addCase(exportReportPDF.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportReportPDF.rejected, (state) => {
        state.exporting = false;
      })
      .addCase(exportReportExcel.pending, (state) => {
        state.exporting = true;
      })
      .addCase(exportReportExcel.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportReportExcel.rejected, (state) => {
        state.exporting = false;
      });
  }
});

export const { clearError, clearReports } = reportSlice.actions;
export default reportSlice.reducer;
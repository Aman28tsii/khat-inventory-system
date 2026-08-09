import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Package, 
  Download, 
  FileText, 
  FileSpreadsheet,
  Printer,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';
import ReportFilters from '../components/ReportFilters';
import { fetchInventoryReport, exportReportPDF, exportReportExcel, clearError } from '../slices/reportSlice';

const InventoryReport = () => {
  const dispatch = useDispatch();
  const { inventoryReport, isLoading, exporting, error } = useSelector((state) => state.reports);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadReport();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadReport = (newFilters = {}) => {
    const appliedFilters = { ...filters, ...newFilters };
    setFilters(appliedFilters);
    dispatch(fetchInventoryReport(appliedFilters));
  };

  const handleExportPDF = async () => {
    try {
      const blob = await dispatch(exportReportPDF({ 
        type: 'inventory', 
        filters,
        data: inventoryReport 
      })).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'inventory-report-' + new Date().toISOString().split('T')[0] + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await dispatch(exportReportExcel({ 
        type: 'inventory', 
        filters,
        data: inventoryReport 
      })).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'inventory-report-' + new Date().toISOString().split('T')[0] + '.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Excel exported successfully');
    } catch (error) {
      toast.error('Failed to export Excel');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      key: 'product',
      label: 'Product',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.productName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.sku}</p>
        </div>
      )
    },
    {
      key: 'batch',
      label: 'Batch',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">{row.batchNumber}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Exp: {new Date(row.expiryDate).toLocaleDateString()}</p>
        </div>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total:</span>
            <span className="font-medium ml-1">{row.totalQuantity}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Available:</span>
            <span className="font-medium ml-1">{row.availableQuantity}</span>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">{row.branch}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{row.shelf || 'No shelf'}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        if (row.isExpiring) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-medium">
              <AlertCircle className="w-3 h-3" />
              Expiring Soon
            </span>
          );
        }
        if (row.isLowStock) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
              <AlertCircle className="w-3 h-3" />
              Low Stock
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            In Stock
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Report
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Detailed inventory status and batch tracking
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            disabled={isLoading || !inventoryReport}
          >
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
          <Button
            variant="secondary"
            size="sm"
            isLoading={exporting}
            onClick={handleExportPDF}
            disabled={isLoading || !inventoryReport}
          >
            <FileText className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={exporting}
            onClick={handleExportExcel}
            disabled={isLoading || !inventoryReport}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ReportFilters
        onApply={(newFilters) => loadReport(newFilters)}
        onClear={() => loadReport({})}
        isLoading={isLoading}
      />

      {/* Summary Cards */}
      {inventoryReport && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {inventoryReport.summary?.totalProducts || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Batches</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {inventoryReport.summary?.totalBatches || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Quantity</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {inventoryReport.summary?.totalQuantity || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-red-600">
              {inventoryReport.summary?.lowStockCount || 0}
            </p>
          </div>
        </div>
      )}

      {/* Report Table */}
      <Table
        columns={columns}
        data={inventoryReport?.data || []}
        loading={isLoading}
        pagination={true}
        pageSize={20}
      />
    </div>
  );
};

export default InventoryReport;

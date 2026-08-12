import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, FileText, FileSpreadsheet, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import ChartWidget from '../../dashboard/components/ChartWidget';
import Button from '../../../components/common/Button/Button';
import ReportFilters from '../components/ReportFilters';
import { fetchSalesReport, exportReportPDF, exportReportExcel, clearError } from '../slices/reportSlice';
import { useLanguage } from '../../../context/LanguageContext';

const SalesReport = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { salesReport, isLoading, exporting, error } = useSelector((state) => state.reports);
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
    dispatch(fetchSalesReport(appliedFilters));
  };

  const handleExportPDF = async () => {
    try {
      const blob = await dispatch(exportReportPDF({ type: 'sales', filters, data: salesReport })).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sales-report-' + new Date().toISOString().split('T')[0] + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(t('reports.exportPDF') + ' ' + t('common.success'));
    } catch (error) {
      toast.error(t('errors.generic'));
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await dispatch(exportReportExcel({ type: 'sales', filters, data: salesReport })).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sales-report-' + new Date().toISOString().split('T')[0] + '.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(t('reports.exportExcel') + ' ' + t('common.success'));
    } catch (error) {
      toast.error(t('errors.generic'));
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return '$' + num.toFixed(2);
  };

  const columns = [
    {
      key: 'saleNumber',
      label: t('sales.saleNumber'),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.saleNumber}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(row.date).toLocaleDateString()}</p>
        </div>
      )
    },
    {
      key: 'customer',
      label: t('sales.customer'),
      render: (row) => {
        const customerName = typeof row.customer === 'object' ? row.customer?.name || 'Walk-in' : row.customer || 'Walk-in';
        return (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white">{customerName}</span>
          </div>
        );
      }
    },
    {
      key: 'items',
      label: t('sales.items'),
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm text-gray-900 dark:text-white">{row.itemCount || 0} {t('sales.items')}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{row.productNames || ''}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: t('sales.totalAmount'),
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(row.totalAmount)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t('sales.paidAmount')}: {formatCurrency(row.paidAmount)}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: t('common.status'),
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400')}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <img src="/src/assets/images/brand/logo-small.svg" alt={t('appName')} className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('reports.salesReport')}</h1>
              <p className="text-gray-500 dark:text-gray-400">{t('reports.salesReport')}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" isLoading={exporting} onClick={handleExportPDF} disabled={isLoading || !salesReport}>
            <FileText className="w-4 h-4 mr-1" /> {t('reports.exportPDF')}
          </Button>
          <Button variant="primary" size="sm" isLoading={exporting} onClick={handleExportExcel} disabled={isLoading || !salesReport}>
            <FileSpreadsheet className="w-4 h-4 mr-1" /> {t('reports.exportExcel')}
          </Button>
        </div>
      </div>

      <ReportFilters onApply={(newFilters) => loadReport(newFilters)} onClear={() => loadReport({})} isLoading={isLoading} />

      {salesReport && salesReport.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('sales.total')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{salesReport.summary.totalSales || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.revenue')}</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(salesReport.summary.totalRevenue)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.averageOrderValue')}</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(salesReport.summary.averageOrderValue)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.topProduct')}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{salesReport.summary.topProduct || 'N/A'}</p>
          </div>
        </div>
      )}

      <ChartWidget
        title={t('salesTrend')}
        data={salesReport?.trendData || []}
        type="line"
        series={[{ key: 'sales', name: t('sales.title') }, { key: 'revenue', name: t('reports.revenue') }]}
        xAxisKey="day"
      />

      <Table columns={columns} data={salesReport?.data || []} loading={isLoading} pagination={true} pageSize={20} />
    </div>
  );
};

export default SalesReport;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp, Calendar, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';
import ChartWidget from '../../dashboard/components/ChartWidget';
import ReportFilters from '../components/ReportFilters';
import { fetchProfitReport, exportReportPDF, exportReportExcel, clearError } from '../slices/reportSlice';
import { useLanguage } from '../../../context/LanguageContext';

const ProfitReport = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { profitReport, isLoading, exporting, error } = useSelector((state) => state.reports);
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
    dispatch(fetchProfitReport(appliedFilters));
  };

  const handleExportPDF = async () => {
    try {
      const blob = await dispatch(exportReportPDF({ type: 'profit', filters, data: profitReport })).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'profit-report-' + new Date().toISOString().split('T')[0] + '.pdf';
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
      const blob = await dispatch(exportReportExcel({ type: 'profit', filters, data: profitReport })).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'profit-report-' + new Date().toISOString().split('T')[0] + '.xlsx';
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

  const formatPercentage = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0.0%';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toFixed(1) + '%';
  };

  const columns = [
    {
      key: 'date',
      label: t('reports.dateRange'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(row.date).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'revenue',
      label: t('reports.revenue'),
      render: (row) => <span className="font-medium text-green-600">{formatCurrency(row.revenue)}</span>
    },
    {
      key: 'cost',
      label: t('reports.cost'),
      render: (row) => <span className="font-medium text-red-600">{formatCurrency(row.cost)}</span>
    },
    {
      key: 'profit',
      label: t('reports.profit'),
      render: (row) => <span className="font-bold text-blue-600">{formatCurrency(row.profit)}</span>
    },
    {
      key: 'margin',
      label: t('reports.margin'),
      render: (row) => {
        const revenue = typeof row.revenue === 'string' ? parseFloat(row.revenue) : (row.revenue || 0);
        const profit = typeof row.profit === 'string' ? parseFloat(row.profit) : (row.profit || 0);
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        return <span className={'font-medium ' + (margin > 30 ? 'text-green-600' : margin > 15 ? 'text-yellow-600' : 'text-red-600')}>{margin.toFixed(1)}%</span>;
      }
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <img src="/src/assets/images/brand/logo-small.svg" alt={t('appName')} className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('reports.profitReport')}</h1>
              <p className="text-gray-500 dark:text-gray-400">{t('reports.profitReport')}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" isLoading={exporting} onClick={handleExportPDF} disabled={isLoading || !profitReport}>
            <FileText className="w-4 h-4 mr-1" /> {t('reports.exportPDF')}
          </Button>
          <Button variant="primary" size="sm" isLoading={exporting} onClick={handleExportExcel} disabled={isLoading || !profitReport}>
            <FileSpreadsheet className="w-4 h-4 mr-1" /> {t('reports.exportExcel')}
          </Button>
        </div>
      </div>

      <ReportFilters onApply={(newFilters) => loadReport(newFilters)} onClear={() => loadReport({})} isLoading={isLoading} />

      {profitReport && profitReport.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.revenue')}</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(profitReport.summary.totalRevenue)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.cost')}</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(profitReport.summary.totalCost)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.profit')}</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(profitReport.summary.totalProfit)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.margin')}</p>
            <p className="text-2xl font-bold text-purple-600">{formatPercentage(profitReport.summary.averageMargin)}</p>
          </div>
        </div>
      )}

      <ChartWidget
        title={t('reports.profit')}
        data={profitReport?.dailyData || []}
        type="line"
        series={[
          { key: 'revenue', name: t('reports.revenue') },
          { key: 'cost', name: t('reports.cost') },
          { key: 'profit', name: t('reports.profit') }
        ]}
        xAxisKey="date"
      />

      <Table columns={columns} data={profitReport?.sales || []} loading={isLoading} pagination={true} pageSize={20} />
    </div>
  );
};

export default ProfitReport;


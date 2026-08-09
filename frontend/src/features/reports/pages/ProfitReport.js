import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';
import ChartWidget from '../../dashboard/components/ChartWidget';
import { fetchProfitReport, clearError } from '../slices/reportSlice';

const ProfitReport = () => {
  const dispatch = useDispatch();
  const { profitReport, isLoading, error } = useSelector((state) => state.reports);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    dispatch(fetchProfitReport(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const mockData = [
    { month: 'Jan', revenue: 12000, cost: 8000, profit: 4000 },
    { month: 'Feb', revenue: 15000, cost: 9500, profit: 5500 },
    { month: 'Mar', revenue: 18000, cost: 11000, profit: 7000 },
    { month: 'Apr', revenue: 14000, cost: 9000, profit: 5000 },
    { month: 'May', revenue: 20000, cost: 12000, profit: 8000 },
    { month: 'Jun', revenue: 22000, cost: 13000, profit: 9000 },
  ];

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(row.date).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (row) => <span className="font-medium text-green-600"></span>
    },
    {
      key: 'cost',
      label: 'Cost',
      render: (row) => <span className="font-medium text-red-600"></span>
    },
    {
      key: 'profit',
      label: 'Profit',
      render: (row) => <span className="font-bold text-blue-600"></span>
    },
    {
      key: 'margin',
      label: 'Margin %',
      render: (row) => {
        const margin = (row.profit / row.revenue) * 100;
        return <span className={'font-medium ' + (margin > 30 ? 'text-green-600' : margin > 15 ? 'text-yellow-600' : 'text-red-600')}>{margin.toFixed(1)}%</span>;
      }
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profit Report</h1>
          <p className="text-gray-500 dark:text-gray-400">Analyze profit and loss across the business</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <FileText className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button variant="primary" size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-1" />
            Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">,000</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Cost</p>
          <p className="text-2xl font-bold text-red-600">,500</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Net Profit</p>
          <p className="text-2xl font-bold text-blue-600">,500</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Profit Margin</p>
          <p className="text-2xl font-bold text-purple-600">38.1%</p>
        </div>
      </div>

      <ChartWidget
        title="Profit Trend"
        data={mockData}
        type="line"
        series={[
          { key: 'revenue', name: 'Revenue' },
          { key: 'cost', name: 'Cost' },
          { key: 'profit', name: 'Profit' }
        ]}
        xAxisKey="month"
      />

      <Table
        columns={columns}
        data={mockData}
        loading={isLoading}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};

export default ProfitReport;

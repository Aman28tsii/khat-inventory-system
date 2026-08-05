import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Calendar, Filter, X, Users, Clock } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { fetchResources, fetchActions } from '../slices/auditSlice';

const AuditFilters = ({ onApply, onClear, isLoading = false }) => {
  const dispatch = useDispatch();
  const [resources, setResources] = useState([]);
  const [actions, setActions] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'thisMonth',
    startDate: '',
    endDate: '',
    resourceType: '',
    action: '',
    userId: '',
    search: ''
  });

  useEffect(() => {
    // In real app, fetch from API
    setResources([
      'USER', 'ROLE', 'BRANCH', 'PRODUCT', 'INVENTORY', 
      'SALE', 'PURCHASE', 'TRANSFER', 'CUSTOMER', 'SUPPLIER',
      'SETTINGS', 'REPORT', 'AUDIT'
    ]);
    setActions([
      'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 
      'LOGOUT', 'VIEW', 'EXPORT', 'IMPORT'
    ]);
  }, []);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleDateRangeChange = (value) => {
    setFilters({ ...filters, dateRange: value });
    if (value !== 'custom') {
      setFilters({ ...filters, dateRange: value, startDate: '', endDate: '' });
    }
  };

  const handleApply = () => {
    const appliedFilters = { ...filters };
    if (appliedFilters.dateRange === 'custom') {
      // Keep custom dates
    } else {
      delete appliedFilters.startDate;
      delete appliedFilters.endDate;
    }
    onApply(appliedFilters);
  };

  const handleClear = () => {
    setFilters({
      dateRange: 'thisMonth',
      startDate: '',
      endDate: '',
      resourceType: '',
      action: '',
      userId: '',
      search: ''
    });
    onClear();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
        <span className="text-xs text-gray-400 ml-auto">
          {Object.values(filters).filter(v => v).length} filters active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Search
          </label>
          <Input
            placeholder="Search logs..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Date Range
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            value={filters.dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {filters.dateRange === 'custom' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="text-sm"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Resource Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            value={filters.resourceType}
            onChange={(e) => setFilters({ ...filters, resourceType: e.target.value })}
          >
            <option value="">All Resources</option>
            {resources.map((resource) => (
              <option key={resource} value={resource}>{resource}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Action
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          >
            <option value="">All Actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            User
          </label>
          <Input
            placeholder="User ID or Email"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            className="text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleClear}
          disabled={isLoading}
        >
          <X className="w-4 h-4 mr-1" />
          Clear All
        </Button>
        <Button
          variant="primary"
          size="sm"
          isLoading={isLoading}
          onClick={handleApply}
        >
          <Filter className="w-4 h-4 mr-1" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default AuditFilters;
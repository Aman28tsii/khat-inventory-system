import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import Table from '../../../components/common/Table/Table';

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', dateRange: '' });

  useEffect(() => {
    // Mock data for now
    const mockMovements = [
      {
        id: 1,
        movementType: 'IN',
        quantity: 100,
        previousQuantity: 0,
        newQuantity: 100,
        createdAt: new Date().toISOString(),
        product: { name: 'Green Khat' },
        branch: { name: 'Main Warehouse' },
        creator: { firstName: 'System', lastName: 'Admin' }
      },
      {
        id: 2,
        movementType: 'OUT',
        quantity: 25,
        previousQuantity: 100,
        newQuantity: 75,
        createdAt: new Date().toISOString(),
        product: { name: 'Green Khat' },
        branch: { name: 'Branch A' },
        creator: { firstName: 'John', lastName: 'Doe' }
      }
    ];
    setMovements(mockMovements);
  }, []);

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.movementType === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
          {row.movementType}
        </span>
      )
    },
    {
      key: 'product',
      label: 'Product',
      render: (row) => row.product?.name || 'N/A'
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm font-medium">{row.quantity}</div>
          <div className="text-xs text-gray-500">From: {row.previousQuantity} → To: {row.newQuantity}</div>
        </div>
      )
    },
    {
      key: 'branch',
      label: 'Branch',
      render: (row) => row.branch?.name || 'N/A'
    },
    {
      key: 'createdBy',
      label: 'Created By',
      render: (row) => row.creator?.firstName + ' ' + row.creator?.lastName || 'N/A'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Movements</h1>
          <p className="text-gray-500 dark:text-gray-400">Track all inventory movements across branches</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search movements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={movements}
        loading={isLoading}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};

export default StockMovements;

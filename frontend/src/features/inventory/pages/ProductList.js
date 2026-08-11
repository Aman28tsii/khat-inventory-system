import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import BulkImport from '../../../components/common/BulkImport/BulkImport';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  Upload, 
  Power,
  Search,
  Box,
  Tag,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { fetchProducts, deleteProduct, clearError } from '../slices/productSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error, total } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    subCategory: '',
    description: '',
    unit: 'KG',
    minStockQuantity: '',
    maxStockQuantity: '',
    reorderLevel: '',
    isActive: true
  });

  useEffect(() => {
    dispatch(fetchProducts({ search: debouncedSearch, page, limit }));
  }, [dispatch, debouncedSearch, page, limit]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await dispatch(deleteProduct(product.id)).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await dispatch(updateProduct({ id: selectedProduct.id, data: formData })).unwrap();
      } else {
        await dispatch(createProduct(formData)).unwrap();
      }
      setShowModal(false);
      toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully');
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.sku}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <div>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs">
            {row.category || 'Uncategorized'}
          </span>
          {row.subCategory && (
            <span className="ml-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500">
              {row.subCategory}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock Info',
      render: (row) => (
        <div className="space-y-0.5 text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Box className="w-3 h-3" />
            <span>Min: {row.minStockQuantity || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <AlertCircle className="w-3 h-3" />
            <span>Reorder: {row.reorderLevel || 0}</span>
          </div>
        </div>
      )
    },
    {
      key: 'unit',
      label: 'Unit',
      render: (row) => (
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
          {row.unit}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedProduct(row);
              setFormData({
                name: row.name,
                sku: row.sku,
                category: row.category || '',
                subCategory: row.subCategory || '',
                description: row.description || '',
                unit: row.unit,
                minStockQuantity: row.minStockQuantity || '',
                maxStockQuantity: row.maxStockQuantity || '',
                reorderLevel: row.reorderLevel || '',
                isActive: row.isActive
              });
              setIsEditing(true);
              setShowModal(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage products and inventory items
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowBulkImport(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedProduct(null);
              setFormData({
                name: '',
                sku: '',
                category: '',
                subCategory: '',
                description: '',
                unit: 'KG',
                minStockQuantity: '',
                maxStockQuantity: '',
                reorderLevel: '',
                isActive: true
              });
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Products Table */}
      {isLoading && <LoadingSpinner />}
      {products.length === 0 && !isLoading && (
        <EmptyState 
          title='No Products Found' 
          description='Start by adding your first product' 
          actionText='Add Product' 
          onAction={() => {
            setSelectedProduct(null);
            setFormData({
              name: '',
              sku: '',
              category: '',
              subCategory: '',
              description: '',
              unit: 'KG',
              minStockQuantity: '',
              maxStockQuantity: '',
              reorderLevel: '',
              isActive: true
            });
            setIsEditing(false);
            setShowModal(true);
          }}
        />
      )}
      <Table
        columns={columns}
        data={products}
        loading={isLoading}
      />

      {/* Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        title={isEditing ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Green Khat"
            />
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              placeholder="e.g., KHAT-001"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Green, Yellow"
            />
            <Input
              label="Sub Category"
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              placeholder="e.g., Premium, Standard"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="KG"
            />
            <Input
              label="Min Stock"
              type="number"
              value={formData.minStockQuantity}
              onChange={(e) => setFormData({ ...formData, minStockQuantity: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Max Stock"
              type="number"
              value={formData.maxStockQuantity}
              onChange={(e) => setFormData({ ...formData, maxStockQuantity: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Reorder Level"
              type="number"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <BulkImport
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        type="products"
        onSuccess={() => {
          dispatch(fetchProducts());
          toast.success('Products imported successfully');
        }}
      />
    </div>
  );
};

export default ProductList;
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
import { useLanguage } from '../../../context/LanguageContext';

const ProductList = () => {
  const { t } = useLanguage();
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
    if (window.confirm(t('modals.areYouSure') + ' "' + product.name + '"?')) {
      try {
        await dispatch(deleteProduct(product.id)).unwrap();
        toast.success(t('common.delete') + ' ' + t('products.productName'));
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
      toast.success(isEditing ? t('products.editProduct') + ' ' + t('common.success') : t('products.createProduct') + ' ' + t('common.success'));
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: t('products.productName'),
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
      label: t('products.category'),
      render: (row) => (
        <div>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs">
            {row.category || t('common.none')}
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
      label: t('inventory.stockMovements'),
      render: (row) => (
        <div className="space-y-0.5 text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Box className="w-3 h-3" />
            <span>{t('products.minStock')}: {row.minStockQuantity || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <AlertCircle className="w-3 h-3" />
            <span>{t('products.reorderLevel')}: {row.reorderLevel || 0}</span>
          </div>
        </div>
      )
    },
    {
      key: 'unit',
      label: t('products.unit'),
      render: (row) => (
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
          {row.unit}
        </span>
      )
    },
    {
      key: 'status',
      label: t('status'),
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')}>
          {row.isActive ? t('active') : t('common.inactive')}
        </span>
      )
    },
    {
      key: 'actions',
      label: t('actions'),
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('products.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('products.productManagement')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowBulkImport(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('products.importCSV')}
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
            {t('products.addProduct')}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={t('search') + ' ' + t('products.productName') + ' ' + t('or') + ' ' + t('products.sku') + '...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {products.length === 0 && !isLoading && (
        <EmptyState 
          title={t('products.noProducts')} 
          description={t('common.add') + ' ' + t('products.productName')} 
          actionText={t('products.addProduct')} 
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

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        title={isEditing ? t('products.editProduct') : t('products.createProduct')}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('products.productName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Green Khat"
            />
            <Input
              label={t('products.sku')}
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              placeholder="e.g., KHAT-001"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('products.category')}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Green, Yellow"
            />
            <Input
              label={t('products.subCategory')}
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              placeholder="e.g., Premium, Standard"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('products.description')}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('products.description')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label={t('products.unit')}
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="KG"
            />
            <Input
              label={t('products.minStock')}
              type="number"
              value={formData.minStockQuantity}
              onChange={(e) => setFormData({ ...formData, minStockQuantity: e.target.value })}
              placeholder="0"
            />
            <Input
              label={t('products.maxStock')}
              type="number"
              value={formData.maxStockQuantity}
              onChange={(e) => setFormData({ ...formData, maxStockQuantity: e.target.value })}
              placeholder="0"
            />
            <Input
              label={t('products.reorderLevel')}
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
              {t('active')}
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? t('products.editProduct') : t('products.createProduct')}
            </Button>
          </div>
        </div>
      </Modal>

      <BulkImport
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        type="products"
        onSuccess={() => {
          dispatch(fetchProducts());
          toast.success(t('products.bulkImport') + ' ' + t('common.success'));
        }}
      />
    </div>
  );
};

export default ProductList;



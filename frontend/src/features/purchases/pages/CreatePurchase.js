import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Plus, 
  Trash2,
  Truck,
  Users,
  Calendar,
  DollarSign,
  Package,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { createPurchase } from '../slices/purchaseSlice';
import { useLanguage } from '../../../context/LanguageContext';

const CreatePurchase = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.purchases);
  const { suppliers } = useSelector((state) => state.suppliers || { suppliers: [] });
  const { branches } = useSelector((state) => state.branches || { branches: [] });
  const { products } = useSelector((state) => state.products || { products: [] });

  const [formData, setFormData] = useState({
    supplierId: '',
    branchId: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    notes: '',
    items: []
  });

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: '',
    unitPrice: '',
    notes: ''
  });

  const [itemErrors, setItemErrors] = useState({});

  const addItem = () => {
    if (!currentItem.productId) {
      toast.error(t('validation.required'));
      return;
    }
    if (!currentItem.quantity || parseFloat(currentItem.quantity) <= 0) {
      toast.error(t('validation.required'));
      return;
    }
    if (!currentItem.unitPrice || parseFloat(currentItem.unitPrice) <= 0) {
      toast.error(t('validation.required'));
      return;
    }

    const product = products.find(p => p.id === currentItem.productId);
    const item = {
      id: Date.now().toString(),
      productId: currentItem.productId,
      productName: product?.name || 'Unknown Product',
      quantity: parseFloat(currentItem.quantity),
      unitPrice: parseFloat(currentItem.unitPrice),
      totalPrice: parseFloat(currentItem.quantity) * parseFloat(currentItem.unitPrice),
      notes: currentItem.notes
    };

    setFormData({
      ...formData,
      items: [...formData.items, item]
    });

    setCurrentItem({
      productId: '',
      quantity: '',
      unitPrice: '',
      notes: ''
    });
    setItemErrors({});
  };

  const removeItem = (itemId) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const handleSubmit = async () => {
    if (!formData.supplierId) {
      toast.error(t('validation.required'));
      return;
    }
    if (!formData.branchId) {
      toast.error(t('validation.required'));
      return;
    }
    if (formData.items.length === 0) {
      toast.error(t('validation.required'));
      return;
    }

    const purchaseData = {
      ...formData,
      subtotal: calculateTotal(),
      tax: 0,
      discount: 0,
      totalAmount: calculateTotal()
    };

    try {
      await dispatch(createPurchase(purchaseData)).unwrap();
      toast.success(t('purchases.createPurchase') + ' ' + t('common.success'));
      navigate('/purchases');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('purchases.createPurchase')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('purchases.createPurchase')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/purchases')}>
            <X className="w-4 h-4 mr-2" />
            {t('common.cancel')}
          </Button>
          <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {t('purchases.createPurchase')}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('purchases.supplier')} <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
            >
              <option value="">{t('purchases.supplier')}</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('inventory.branch')} <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.branchId}
              onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
            >
              <option value="">{t('inventory.branch')}</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('purchases.purchaseDate')}
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />
          <Input
            label={t('purchases.expectedDelivery')}
            type="date"
            value={formData.expectedDelivery}
            onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('common.notes')}
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder={t('common.notes')}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('purchases.purchaseItems')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('inventory.productName')} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={currentItem.productId}
                onChange={(e) => setCurrentItem({ ...currentItem, productId: e.target.value })}
              >
                <option value="">{t('inventory.productName')}</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('inventory.quantity')} <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('inventory.purchasePrice')} <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={currentItem.unitPrice}
                onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end">
              <Button variant="primary" onClick={addItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {t('sales.addItem')}
              </Button>
            </div>
          </div>

          {formData.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.productName')}</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.quantity')}</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.purchasePrice')}</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('sales.totalAmount')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {formData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.productName}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white"></td>
                      <td className="px-4 py-2 text-sm text-right font-medium text-gray-900 dark:text-white"></td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 dark:bg-gray-900/50 font-medium">
                    <td colSpan="3" className="px-4 py-2 text-right text-gray-900 dark:text-white">
                      {t('sales.totalAmount')}
                    </td>
                    <td className="px-4 py-2 text-right text-lg text-primary-600 dark:text-primary-400">
                      
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">{t('sales.addItem')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePurchase;

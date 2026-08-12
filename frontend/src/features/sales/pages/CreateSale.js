import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Plus, 
  Trash2,
  Users,
  Calendar,
  DollarSign,
  Package,
  Search,
  ShoppingCart,
  CreditCard,
  UserPlus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import { createSale } from '../slices/saleSlice';
import { fetchAvailableBatches, clearBatches } from '../slices/saleSlice';
import { useLanguage } from '../../../context/LanguageContext';

const CreateSale = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.sales);
  const { customers } = useSelector((state) => state.customers || { customers: [] });
  const { products } = useSelector((state) => state.products || { products: [] });
  const { availableBatches } = useSelector((state) => state.sales);
  const { branches } = useSelector((state) => state.branches || { branches: [] });

  const [formData, setFormData] = useState({
    customerId: '',
    branchId: '',
    saleDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: []
  });

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    batchId: '',
    quantity: '',
    unitPrice: '',
    batchInfo: null
  });

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    code: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (currentItem.productId) {
      dispatch(fetchAvailableBatches(currentItem.productId));
    } else {
      dispatch(clearBatches());
    }
  }, [dispatch, currentItem.productId]);

  const addItem = () => {
    if (!currentItem.productId) {
      toast.error(t('validation.required'));
      return;
    }
    if (!currentItem.batchId) {
      toast.error(t('validation.required'));
      return;
    }
    if (!currentItem.quantity || parseFloat(currentItem.quantity) <= 0) {
      toast.error(t('validation.required'));
      return;
    }

    const product = products.find(p => p.id === currentItem.productId);
    const batch = availableBatches.find(b => b.id === currentItem.batchId);
    
    const item = {
      id: Date.now().toString(),
      productId: currentItem.productId,
      productName: product?.name || 'Unknown Product',
      batchId: currentItem.batchId,
      batchNumber: batch?.batchNumber || 'N/A',
      quantity: parseFloat(currentItem.quantity),
      unitPrice: parseFloat(currentItem.unitPrice) || batch?.sellingPrice || 0,
      totalPrice: parseFloat(currentItem.quantity) * (parseFloat(currentItem.unitPrice) || batch?.sellingPrice || 0),
      availableQuantity: batch?.remainingQuantity || 0
    };

    setFormData({
      ...formData,
      items: [...formData.items, item]
    });

    setCurrentItem({
      productId: '',
      batchId: '',
      quantity: '',
      unitPrice: '',
      batchInfo: null
    });
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

  const handleCreateCustomer = async () => {
    toast.success(t('customers.createCustomer') + ' ' + t('common.success'));
    setShowCustomerModal(false);
  };

  const handleSubmit = async () => {
    if (formData.items.length === 0) {
      toast.error(t('validation.required'));
      return;
    }

    const saleData = {
      ...formData,
      subtotal: calculateTotal(),
      tax: 0,
      discount: 0,
      totalAmount: calculateTotal(),
      paidAmount: 0,
      status: 'COMPLETED',
      paymentStatus: 'PENDING'
    };

    try {
      await dispatch(createSale(saleData)).unwrap();
      toast.success(t('sales.createSale') + ' ' + t('common.success'));
      navigate('/sales');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('sales.newSale')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('sales.newSale')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/sales')}>
            <X className="w-4 h-4 mr-2" />
            {t('common.cancel')}
          </Button>
          <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {t('sales.completeSale')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('sales.customer')}
                </label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  >
                    <option value="">{t('sales.walkInCustomer')}</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.code})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('inventory.branch')}
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

            <Input
              label={t('sales.saleDate')}
              type="date"
              value={formData.saleDate}
              onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
            />

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
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('sales.addItem')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('inventory.productName')}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={currentItem.productId}
                  onChange={(e) => setCurrentItem({ 
                    ...currentItem, 
                    productId: e.target.value,
                    batchId: '',
                    batchInfo: null 
                  })}
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
                  {t('inventory.batch')}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={currentItem.batchId}
                  onChange={(e) => {
                    const batch = availableBatches.find(b => b.id === e.target.value);
                    setCurrentItem({ 
                      ...currentItem, 
                      batchId: e.target.value,
                      batchInfo: batch,
                      unitPrice: batch?.sellingPrice || ''
                    });
                  }}
                  disabled={!currentItem.productId}
                >
                  <option value="">{t('inventory.batch')}</option>
                  {availableBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNumber} ({t('inventory.availableQuantity')}: {batch.remainingQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('inventory.quantity')}
                </label>
                <Input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                  placeholder="0"
                  max={currentItem.batchInfo?.remainingQuantity}
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.batch')}</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.quantity')}</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('sales.itemPrice')}</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('sales.itemTotal')}</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.productName}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{item.batchNumber}</td>
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
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">{t('sales.cartEmpty')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-20">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('sales.saleSummary')}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('sales.items')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{formData.items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('sales.subtotal')}</span>
                <span className="font-medium text-gray-900 dark:text-white"></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('sales.tax')}</span>
                <span className="font-medium text-gray-900 dark:text-white">.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('sales.discount')}</span>
                <span className="font-medium text-gray-900 dark:text-white">.00</span>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">{t('sales.totalAmount')}</span>
                  <span className="text-primary-600 dark:text-primary-400"></span>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full mt-4" 
                isLoading={isLoading}
                onClick={handleSubmit}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {t('sales.completeSale')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title={t('sales.quickAddCustomer')}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label={t('customers.customerName')}
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label={t('auth.phone')}
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            placeholder="+251-XXX-XXXX"
          />
          <Input
            label={t('email')}
            type="email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            placeholder="customer@email.com"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('branches.address')}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="2"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              placeholder={t('branches.address')}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleCreateCustomer}>
              {t('customers.createCustomer')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateSale;




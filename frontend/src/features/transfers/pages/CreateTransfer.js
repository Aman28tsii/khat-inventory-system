import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Plus, 
  Trash2,
  Calendar,
  Package,
  ArrowLeftRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { createTransfer, fetchAvailableBatches, clearBatches, addItem, removeItem } from '../slices/transferSlice';
import { useLanguage } from '../../../context/LanguageContext';

const CreateTransfer = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, availableBatches, items } = useSelector((state) => state.transfers);
  const { branches } = useSelector((state) => state.branches || { branches: [] });

  const [formData, setFormData] = useState({
    fromBranchId: '',
    toBranchId: '',
    transferDate: new Date().toISOString().split('T')[0],
    expectedArrival: '',
    notes: ''
  });

  const [currentItem, setCurrentItem] = useState({
    batchId: '',
    quantity: '',
    batchInfo: null
  });

  useEffect(() => {
    if (formData.fromBranchId) {
      dispatch(fetchAvailableBatches(formData.fromBranchId));
    } else {
      dispatch(clearBatches());
    }
  }, [dispatch, formData.fromBranchId]);

  const handleAddItem = () => {
    if (!currentItem.batchId) {
      toast.error(t('validation.required'));
      return;
    }
    if (!currentItem.quantity || parseFloat(currentItem.quantity) <= 0) {
      toast.error(t('validation.required'));
      return;
    }

    const batch = availableBatches.find(b => b.id === currentItem.batchId);
    if (parseFloat(currentItem.quantity) > batch?.remainingQuantity) {
      toast.error(t('inventory.availableQuantity'));
      return;
    }

    const item = {
      id: Date.now().toString(),
      batchId: currentItem.batchId,
      batchNumber: batch?.batchNumber || 'N/A',
      productName: batch?.product?.name || 'Unknown',
      quantity: parseFloat(currentItem.quantity),
      availableQuantity: batch?.remainingQuantity || 0
    };

    dispatch(addItem(item));
    setCurrentItem({ batchId: '', quantity: '', batchInfo: null });
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleSubmit = async () => {
    if (!formData.fromBranchId || !formData.toBranchId) {
      toast.error(t('validation.required'));
      return;
    }
    if (formData.fromBranchId === formData.toBranchId) {
      toast.error(t('validation.required'));
      return;
    }
    if (items.length === 0) {
      toast.error(t('validation.required'));
      return;
    }

    const transferData = {
      ...formData,
      items: items.map(item => ({
        batchId: item.batchId,
        quantity: item.quantity
      }))
    };

    try {
      await dispatch(createTransfer(transferData)).unwrap();
      toast.success(t('transfers.createTransfer') + ' ' + t('common.success'));
      navigate('/transfers');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transfers.createTransfer')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('transfers.createTransfer')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/transfers')}>
            <X className="w-4 h-4 mr-2" />
            {t('common.cancel')}
          </Button>
          <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {t('transfers.createTransfer')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('transfers.fromBranch')} <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.fromBranchId}
                  onChange={(e) => setFormData({ ...formData, fromBranchId: e.target.value })}
                >
                  <option value="">{t('transfers.sourceBranch')}</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('transfers.toBranch')} <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.toBranchId}
                  onChange={(e) => setFormData({ ...formData, toBranchId: e.target.value })}
                >
                  <option value="">{t('transfers.destinationBranch')}</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('transfers.transferDate')}
                type="date"
                value={formData.transferDate}
                onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
              />
              <Input
                label={t('transfers.expectedArrival')}
                type="date"
                value={formData.expectedArrival}
                onChange={(e) => setFormData({ ...formData, expectedArrival: e.target.value })}
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
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('transfers.itemsToTransfer')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                      batchInfo: batch
                    });
                  }}
                  disabled={!formData.fromBranchId}
                >
                  <option value="">{t('inventory.batch')}</option>
                  {availableBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNumber} - {batch.product?.name} ({t('inventory.availableQuantity')}: {batch.remainingQuantity})
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
                <Button variant="primary" onClick={handleAddItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('sales.addItem')}
                </Button>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.productName')}</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.batch')}</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.quantity')}</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.productName}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{item.batchNumber}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">{item.quantity}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
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
                <ArrowLeftRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-20">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('transfers.transferSummary')}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('sales.items')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('inventory.totalQuantity')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{t('transfers.fromBranch')}: {branches.find(b => b.id === formData.fromBranchId)?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Package className="w-4 h-4" />
                  <span>{t('transfers.toBranch')}: {branches.find(b => b.id === formData.toBranchId)?.name || 'N/A'}</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full mt-4" 
                isLoading={isLoading}
                onClick={handleSubmit}
              >
                <Save className="w-4 h-4 mr-2" />
                {t('transfers.createTransfer')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransfer;


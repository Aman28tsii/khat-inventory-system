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

const CreateTransfer = () => {
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

  // Fetch available batches when from branch is selected
  useEffect(() => {
    if (formData.fromBranchId) {
      dispatch(fetchAvailableBatches(formData.fromBranchId));
    } else {
      dispatch(clearBatches());
    }
  }, [dispatch, formData.fromBranchId]);

  const handleAddItem = () => {
    if (!currentItem.batchId) {
      toast.error('Please select a batch');
      return;
    }
    if (!currentItem.quantity || parseFloat(currentItem.quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const batch = availableBatches.find(b => b.id === currentItem.batchId);
    if (parseFloat(currentItem.quantity) > batch?.remainingQuantity) {
      toast.error(`Only ${batch?.remainingQuantity} available`);
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
      toast.error('Please select both branches');
      return;
    }
    if (formData.fromBranchId === formData.toBranchId) {
      toast.error('Source and destination branches must be different');
      return;
    }
    if (items.length === 0) {
      toast.error('Please add at least one item');
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
      toast.success('Transfer created successfully');
      navigate('/transfers');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Transfer</h1>
          <p className="text-gray-500 dark:text-gray-400">Transfer stock between branches</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/transfers')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Create Transfer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From Branch <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.fromBranchId}
                  onChange={(e) => setFormData({ ...formData, fromBranchId: e.target.value })}
                >
                  <option value="">Select Source Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To Branch <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.toBranchId}
                  onChange={(e) => setFormData({ ...formData, toBranchId: e.target.value })}
                >
                  <option value="">Select Destination Branch</option>
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
                label="Transfer Date"
                type="date"
                value={formData.transferDate}
                onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
              />
              <Input
                label="Expected Arrival"
                type="date"
                value={formData.expectedArrival}
                onChange={(e) => setFormData({ ...formData, expectedArrival: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any notes for this transfer"
              />
            </div>
          </div>

          {/* Add Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Items to Transfer</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Batch
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
                  <option value="">Select Batch</option>
                  {availableBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNumber} - {batch.product?.name} (Available: {batch.remainingQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity
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
                  Add Item
                </Button>
              </div>
            </div>

            {/* Items List */}
            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Batch</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
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
                <p className="text-gray-500 dark:text-gray-400">No items to transfer</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-20">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Transfer Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Items</span>
                <span className="font-medium text-gray-900 dark:text-white">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Quantity</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>From: {branches.find(b => b.id === formData.fromBranchId)?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Package className="w-4 h-4" />
                  <span>To: {branches.find(b => b.id === formData.toBranchId)?.name || 'N/A'}</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full mt-4" 
                isLoading={isLoading}
                onClick={handleSubmit}
              >
                <Save className="w-4 h-4 mr-2" />
                Create Transfer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransfer;
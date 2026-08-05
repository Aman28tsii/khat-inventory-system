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

const CreateSale = () => {
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

  // Fetch available batches when product is selected
  useEffect(() => {
    if (currentItem.productId) {
      dispatch(fetchAvailableBatches(currentItem.productId));
    } else {
      dispatch(clearBatches());
    }
  }, [dispatch, currentItem.productId]);

  const addItem = () => {
    if (!currentItem.productId) {
      toast.error('Please select a product');
      return;
    }
    if (!currentItem.batchId) {
      toast.error('Please select a batch');
      return;
    }
    if (!currentItem.quantity || parseFloat(currentItem.quantity) <= 0) {
      toast.error('Please enter a valid quantity');
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
    // In real app, dispatch createCustomer
    toast.success('Customer created successfully');
    setShowCustomerModal(false);
    // Add customer to list and select it
  };

  const handleSubmit = async () => {
    if (formData.items.length === 0) {
      toast.error('Please add at least one item');
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
      toast.success('Sale created successfully');
      navigate('/sales');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Sale</h1>
          <p className="text-gray-500 dark:text-gray-400">Create a new sale transaction</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/sales')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Complete Sale
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Sale Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer
                </label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  >
                    <option value="">Walk-in Customer</option>
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
                  Branch
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Sale Date"
              type="date"
              value={formData.saleDate}
              onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any notes for this sale"
              />
            </div>
          </div>

          {/* Add Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Items</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product
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
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>

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
                      batchInfo: batch,
                      unitPrice: batch?.sellingPrice || ''
                    });
                  }}
                  disabled={!currentItem.productId}
                >
                  <option value="">Select Batch</option>
                  {availableBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNumber} (Available: {batch.remainingQuantity})
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
                <Button variant="primary" onClick={addItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Items List */}
            {formData.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Batch</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.productName}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{item.batchNumber}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-gray-900 dark:text-white">${item.totalPrice.toFixed(2)}</td>
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
                <p className="text-gray-500 dark:text-gray-400">No items added</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-20">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sale Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Items</span>
                <span className="font-medium text-gray-900 dark:text-white">{formData.items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Discount</span>
                <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-primary-600 dark:text-primary-400">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full mt-4" 
                isLoading={isLoading}
                onClick={handleSubmit}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Sale
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Quick Add Customer"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Customer Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label="Phone Number"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            placeholder="+251-XXX-XXXX"
          />
          <Input
            label="Email"
            type="email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            placeholder="customer@email.com"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="2"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              placeholder="Customer address"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCustomer}>
              Create Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateSale;
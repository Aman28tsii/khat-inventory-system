import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import { createCustomer, updateCustomer } from '../slices/customerSlice';

const CustomerForm = ({ customer, isEditing, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'INDIVIDUAL',
    phone: '',
    email: '',
    address: '',
    taxId: '',
    creditLimit: '',
    paymentTerms: '',
    isActive: true
  });

  useEffect(() => {
    if (customer && isEditing) {
      setFormData({
        name: customer.name || '',
        code: customer.code || '',
        type: customer.type || 'INDIVIDUAL',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        taxId: customer.taxId || '',
        creditLimit: customer.creditLimit || '',
        paymentTerms: customer.paymentTerms || '',
        isActive: customer.isActive !== undefined ? customer.isActive : true
      });
    }
  }, [customer, isEditing]);

  const handleSubmit = async () => {
    // Validate
    if (!formData.name.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (!formData.code.trim()) {
      toast.error('Customer code is required');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await dispatch(updateCustomer({ id: customer.id, data: formData })).unwrap();
      } else {
        await dispatch(createCustomer(formData)).unwrap();
      }
      onSuccess();
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Customer Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., John Doe"
          required
        />
        <Input
          label="Customer Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          placeholder="e.g., CUST-001"
          required
          disabled={isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Customer Type
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="INDIVIDUAL">Individual</option>
          <option value="BUSINESS">Business</option>
          <option value="WHOLESALE">Wholesale</option>
          <option value="RETAIL">Retail</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+251-XXX-XXXX"
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="customer@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows="2"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Full address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Tax ID (TIN)"
          value={formData.taxId}
          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
          placeholder="e.g., 123456789"
        />
        <Input
          label="Payment Terms"
          value={formData.paymentTerms}
          onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          placeholder="e.g., Net 30"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Credit Limit"
          type="number"
          value={formData.creditLimit}
          onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
          placeholder="0.00"
        />
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active Customer
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
          {isEditing ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </div>
  );
};

export default CustomerForm;



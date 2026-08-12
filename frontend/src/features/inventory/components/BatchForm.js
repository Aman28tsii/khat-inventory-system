import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';

const BatchForm = ({ batch, isEditing, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { products } = useSelector((state) => state.products || { products: [] });
  const { suppliers } = useSelector((state) => state.suppliers || { suppliers: [] });
  const { branches } = useSelector((state) => state.branches || { branches: [] });

  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    branchId: '',
    batchNumber: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    arrivalDate: '',
    harvestDate: '',
    expiryDate: '',
    grade: '',
    moisturePercentage: '',
    freshnessScore: '',
    leafDensity: '',
    stemRatio: '',
    qualityNotes: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    if (batch && isEditing) {
      setFormData({
        productId: batch.productId || batch.product?.id || '',
        supplierId: batch.supplierId || batch.supplier?.id || '',
        branchId: batch.branchId || batch.branch?.id || '',
        batchNumber: batch.batchNumber || '',
        purchasePrice: batch.purchasePrice || '',
        sellingPrice: batch.sellingPrice || '',
        quantity: batch.quantity || '',
        arrivalDate: batch.arrivalDate || '',
        harvestDate: batch.harvestDate || '',
        expiryDate: batch.expiryDate || '',
        grade: batch.grade || '',
        moisturePercentage: batch.moisturePercentage || '',
        freshnessScore: batch.freshnessScore || '',
        leafDensity: batch.leafDensity || '',
        stemRatio: batch.stemRatio || '',
        qualityNotes: batch.qualityNotes || '',
        status: batch.status || 'AVAILABLE'
      });
    }
  }, [batch, isEditing]);

  const handleSubmit = async () => {
    // Validate
    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }
    if (!formData.supplierId) {
      toast.error('Please select a supplier');
      return;
    }
    if (!formData.branchId) {
      toast.error('Please select a branch');
      return;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIsLoading(true);
    try {
      // In real app, dispatch to API
      // await dispatch(isEditing ? updateBatch : createBatch, formData)
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            disabled={isLoading || isEditing}
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
            Supplier <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={formData.supplierId}
            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
            disabled={isLoading}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={formData.branchId}
            onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
            disabled={isLoading}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} ({branch.type})
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Batch Number"
          value={formData.batchNumber}
          onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value.toUpperCase() })}
          placeholder="e.g., BATCH-2024-001"
          disabled={isLoading || isEditing}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Purchase Price"
          type="number"
          value={formData.purchasePrice}
          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
          placeholder="0.00"
          disabled={isLoading}
        />
        <Input
          label="Selling Price"
          type="number"
          value={formData.sellingPrice}
          onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
          placeholder="0.00"
          disabled={isLoading}
        />
        <Input
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="0"
          disabled={isLoading}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Arrival Date"
          type="date"
          value={formData.arrivalDate}
          onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
          disabled={isLoading}
        />
        <Input
          label="Harvest Date"
          type="date"
          value={formData.harvestDate}
          onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
          disabled={isLoading}
        />
        <Input
          label="Expiry Date"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Grade"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          placeholder="e.g., Premium, Standard"
          disabled={isLoading}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            disabled={isLoading}
          >
            <option value="AVAILABLE">Available</option>
            <option value="PARTIAL">Partial</option>
            <option value="EXPIRED">Expired</option>
            <option value="QUARANTINED">Quarantined</option>
            <option value="DISPOSED">Disposed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Moisture %"
          type="number"
          value={formData.moisturePercentage}
          onChange={(e) => setFormData({ ...formData, moisturePercentage: e.target.value })}
          placeholder="0.00"
          disabled={isLoading}
        />
        <Input
          label="Freshness Score"
          type="number"
          value={formData.freshnessScore}
          onChange={(e) => setFormData({ ...formData, freshnessScore: e.target.value })}
          placeholder="1-100"
          disabled={isLoading}
        />
        <Input
          label="Stem Ratio"
          type="number"
          value={formData.stemRatio}
          onChange={(e) => setFormData({ ...formData, stemRatio: e.target.value })}
          placeholder="0.00"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quality Notes
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows="2"
          value={formData.qualityNotes}
          onChange={(e) => setFormData({ ...formData, qualityNotes: e.target.value })}
          placeholder="Quality inspection notes"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
          {isEditing ? 'Update Batch' : 'Create Batch'}
        </Button>
      </div>
    </div>
  );
};

export default BatchForm;


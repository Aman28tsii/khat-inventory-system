import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

const QualityInspectionModal = ({ batch, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    grade: batch?.grade || '',
    moisturePercentage: batch?.moisturePercentage || '',
    freshnessScore: batch?.freshnessScore || '',
    leafDensity: batch?.leafDensity || '',
    stemRatio: batch?.stemRatio || '',
    qualityNotes: batch?.qualityNotes || '',
    isQualityChecked: true
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // In real app, dispatch API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Quality inspection completed successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to save quality inspection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Batch: <span className="font-medium">{batch?.batchNumber}</span>
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Product: <span className="font-medium">{batch?.product?.name}</span>
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Supplier: <span className="font-medium">{batch?.supplier?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Grade"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          placeholder="e.g., Premium, Standard"
          disabled={isLoading}
        />
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
          rows="3"
          value={formData.qualityNotes}
          onChange={(e) => setFormData({ ...formData, qualityNotes: e.target.value })}
          placeholder="Enter quality inspection notes..."
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
          Complete Inspection
        </Button>
      </div>
    </div>
  );
};

export default QualityInspectionModal;

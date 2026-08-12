import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  File, 
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { useLanguage } from '../../../context/LanguageContext';

const BulkImport = ({ isOpen, onClose, type, onSuccess }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error(t('validation.invalidFormat'));
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error(t('validation.required'));
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://khat-inventory-system.onrender.com/api/v1/' + type + '/bulk-import', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      toast.success(t('common.success'));
      setFile(null);
      setUploadProgress(0);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = () => {
    const labels = {
      products: t('inventory.products'),
      suppliers: t('suppliers.title'),
      customers: t('customers.title')
    };
    return labels[type] || type;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('products.bulkImport') + ' ' + getTypeLabel()} size="lg">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('products.bulkImport')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('products.bulkImport') + ' ' + getTypeLabel()}
          </p>
        </div>

        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
          onClick={() => document.getElementById('file-upload').click()}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ) : (
            <div>
              <File className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('common.clickToUpload')}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                CSV {t('common.or')} Excel {t('common.files')}
              </p>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: uploadProgress + '%' }}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleUpload} isLoading={isLoading}>
            {isLoading ? t('common.loading') : t('common.upload')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkImport;


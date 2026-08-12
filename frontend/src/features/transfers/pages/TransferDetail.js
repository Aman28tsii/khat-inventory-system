import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Users,
  Calendar,
  MapPin,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import { fetchTransferById, clearError } from '../slices/transferSlice';
import { useLanguage } from '../../../context/LanguageContext';

const TransferDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTransfer, isLoading, error } = useSelector((state) => state.transfers);

  useEffect(() => {
    dispatch(fetchTransferById(id));
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (isLoading || !selectedTransfer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      APPROVED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      IN_TRANSIT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      RECEIVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/transfers')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('transfers.transferNumber')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {selectedTransfer.transferNumber}
          </p>
        </div>
      </div>

      <div className={'p-4 rounded-lg ' + getStatusColor(selectedTransfer.status)}>
        <div className="flex items-center gap-3">
          {selectedTransfer.status === 'RECEIVED' && <CheckCircle className="w-5 h-5" />}
          {selectedTransfer.status === 'IN_TRANSIT' && <Truck className="w-5 h-5" />}
          {selectedTransfer.status === 'PENDING' && <Clock className="w-5 h-5" />}
          <span className="font-medium">{t('common.status')}: {selectedTransfer.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('transfers.fromBranch')}</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedTransfer.fromBranch?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('transfers.toBranch')}</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedTransfer.toBranch?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('transfers.transferDate')}</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {new Date(selectedTransfer.transferDate).toLocaleDateString()}
          </p>
        </div>
        {selectedTransfer.expectedArrival && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('transfers.expectedArrival')}</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(selectedTransfer.expectedArrival).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('transfers.itemsToTransfer')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.productName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.batch')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.quantity')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {selectedTransfer.items?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {item.product?.name || 'Unknown Product'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {item.batch?.batchNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTransfer.notes && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.notes')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedTransfer.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferDetail;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Printer,
  Download,
  Calendar,
  Users,
  DollarSign,
  Package,
  MapPin,
  FileText,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import { fetchSaleById, clearError } from '../slices/saleSlice';
import { useLanguage } from '../../../context/LanguageContext';

const SaleDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedSale, isLoading, error } = useSelector((state) => state.sales);

  useEffect(() => {
    dispatch(fetchSaleById(id));
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

  if (isLoading || !selectedSale) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      RETURNED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || colors.PENDING;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      PARTIAL: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      PAID: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      OVERDUE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/sales')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('sales.saleNumber')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedSale.saleNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            {t('print')}
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t('common.export')}
          </Button>
          {selectedSale.status === 'PENDING' && (
            <Button variant="primary" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              {t('common.edit')}
            </Button>
          )}
          {selectedSale.paymentStatus !== 'PAID' && selectedSale.status === 'COMPLETED' && (
            <Button variant="success" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              {t('sales.processPayment')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={'p-4 rounded-lg ' + getStatusColor(selectedSale.status)}>
          <div className="flex items-center gap-3">
            {selectedSale.status === 'COMPLETED' && <CheckCircle className="w-5 h-5" />}
            {selectedSale.status === 'PENDING' && <Clock className="w-5 h-5" />}
            {selectedSale.status === 'CANCELLED' && <XCircle className="w-5 h-5" />}
            <span className="font-medium">{t('status')}: {selectedSale.status}</span>
          </div>
        </div>
        <div className={'p-4 rounded-lg ' + getPaymentStatusColor(selectedSale.paymentStatus)}>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">{t('sales.paymentStatus')}: {selectedSale.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('sales.customer')}</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedSale.customer?.name || t('sales.walkInCustomer')}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('inventory.branch')}</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedSale.branch?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('sales.totalAmount')}</p>
              <p className="font-medium text-gray-900 dark:text-white">
                
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('sales.saleDate')}</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {new Date(selectedSale.saleDate).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('sales.paymentStatus')}</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {selectedSale.paymentStatus}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('sales.items')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.productName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.batch')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('inventory.quantity')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('sales.itemPrice')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('sales.itemTotal')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {selectedSale.items?.map((item) => (
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
                  <td className="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">
                    
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900 dark:text-white">
                    
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-900/50 font-medium">
                <td colSpan="4" className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  {t('sales.subtotal')}:
                </td>
                <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50 font-medium">
                <td colSpan="4" className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  {t('sales.tax')}:
                </td>
                <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-900/50 font-medium">
                <td colSpan="4" className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  {t('sales.discount')}:
                </td>
                <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                  
                </td>
              </tr>
              <tr className="bg-primary-50 dark:bg-primary-900/20 font-bold">
                <td colSpan="4" className="px-6 py-4 text-right text-primary-600 dark:text-primary-400">
                  {t('sales.totalAmount')}:
                </td>
                <td className="px-6 py-4 text-right text-primary-600 dark:text-primary-400 text-lg">
                  
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {selectedSale.notes && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.notes')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedSale.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleDetail;




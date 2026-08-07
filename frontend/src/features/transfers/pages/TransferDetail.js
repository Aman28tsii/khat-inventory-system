import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Truck, Package, Users } from 'lucide-react';
import Button from '../../../components/common/Button/Button';

const TransferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
            Transfer Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Transfer #{id || 'TF-000001'}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-blue-500" />
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">PENDING</span>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Transfer details page - Under construction</p>
      </div>
    </div>
  );
};

export default TransferDetail;
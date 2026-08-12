import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { fetchCreditHistory, clearCreditHistory } from '../slices/customerSlice';

const CustomerCreditModal = ({ customerId }) => {
  const dispatch = useDispatch();
  const { creditHistory, isLoading } = useSelector((state) => state.customers);

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCreditHistory(customerId));
    }
    return () => {
      dispatch(clearCreditHistory());
    };
  }, [dispatch, customerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!creditHistory || creditHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Credit History</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">No credit transactions found for this customer</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-green-600 dark:text-green-400">Total Credit Given</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">$12,450</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">Total Payments</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">$8,200</p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-xs text-yellow-600 dark:text-yellow-400">Current Balance</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">$4,250</p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {creditHistory.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {transaction.type === 'CREDIT' ? (
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${
                transaction.type === 'CREDIT' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {transaction.type === 'CREDIT' ? '+' : '-'}${transaction.amount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Balance: ${transaction.balance}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerCreditModal;


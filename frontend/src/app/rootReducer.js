import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import purchasesReducer from '../features/purchases/slices/purchaseSlice';
import salesReducer from '../features/sales/slices/saleSlice';
import transfersReducer from '../features/transfers/slices/transferSlice';
import dashboardReducer from '../features/dashboard/slices/dashboardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  purchases: purchasesReducer,
  sales: salesReducer,
  transfers: transfersReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;

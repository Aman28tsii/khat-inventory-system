import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import usersReducer from '../features/users/slices/usersSlice';
import rolesReducer from '../features/roles/slices/rolesSlice';
import branchesReducer from '../features/branches/slices/branchesSlice';
import productsReducer from '../features/inventory/slices/productSlice';
import customersReducer from '../features/customers/slices/customerSlice';
import purchasesReducer from '../features/purchases/slices/purchaseSlice';
import salesReducer from '../features/sales/slices/saleSlice';
import transfersReducer from '../features/transfers/slices/transferSlice';
import dashboardReducer from '../features/dashboard/slices/dashboardSlice';
import reportsReducer from '../features/reports/slices/reportSlice';
import notificationsReducer from '../features/notifications/slices/notificationSlice';
import auditReducer from '../features/audit/slices/auditSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  roles: rolesReducer,
  branches: branchesReducer,
  products: productsReducer,
  customers: customersReducer,
  purchases: purchasesReducer,
  sales: salesReducer,
  transfers: transfersReducer,
  dashboard: dashboardReducer,
  reports: reportsReducer,
  notifications: notificationsReducer,
  audit: auditReducer,
});

export default rootReducer;
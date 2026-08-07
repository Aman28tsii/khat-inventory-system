import { combineReducers } from '@reduxjs/toolkit';

// Lazy load reducers to avoid circular dependencies
const rootReducer = combineReducers({
  auth: (state, action) => {
    if (action.type?.startsWith?.('auth/')) {
      return require('../features/auth/slices/authSlice').default(state, action);
    }
    return state;
  },
  users: (state, action) => {
    if (action.type?.startsWith?.('users/')) {
      return require('../features/users/slices/usersSlice').default(state, action);
    }
    return state;
  },
  roles: (state, action) => {
    if (action.type?.startsWith?.('roles/')) {
      return require('../features/roles/slices/rolesSlice').default(state, action);
    }
    return state;
  },
  branches: (state, action) => {
    if (action.type?.startsWith?.('branches/')) {
      return require('../features/branches/slices/branchesSlice').default(state, action);
    }
    return state;
  },
  products: (state, action) => {
    if (action.type?.startsWith?.('products/')) {
      return require('../features/inventory/slices/productSlice').default(state, action);
    }
    return state;
  },
  customers: (state, action) => {
    if (action.type?.startsWith?.('customers/')) {
      return require('../features/customers/slices/customerSlice').default(state, action);
    }
    return state;
  },
  purchases: (state, action) => {
    if (action.type?.startsWith?.('purchases/')) {
      return require('../features/purchases/slices/purchaseSlice').default(state, action);
    }
    return state;
  },
  sales: (state, action) => {
    if (action.type?.startsWith?.('sales/')) {
      return require('../features/sales/slices/saleSlice').default(state, action);
    }
    return state;
  },
  transfers: (state, action) => {
    if (action.type?.startsWith?.('transfers/')) {
      return require('../features/transfers/slices/transferSlice').default(state, action);
    }
    return state;
  },
  dashboard: (state, action) => {
    if (action.type?.startsWith?.('dashboard/')) {
      return require('../features/dashboard/slices/dashboardSlice').default(state, action);
    }
    return state;
  },
  reports: (state, action) => {
    if (action.type?.startsWith?.('reports/')) {
      return require('../features/reports/slices/reportSlice').default(state, action);
    }
    return state;
  },
  notifications: (state, action) => {
    if (action.type?.startsWith?.('notifications/')) {
      return require('../features/notifications/slices/notificationSlice').default(state, action);
    }
    return state;
  },
  audit: (state, action) => {
    if (action.type?.startsWith?.('audit/')) {
      return require('../features/audit/slices/auditSlice').default(state, action);
    }
    return state;
  },
});

export default rootReducer;
import { combineReducers } from '@reduxjs/toolkit';

// Create a map of reducers that will be loaded on demand
const reducerMap = {};

// Function to get a reducer safely
const getReducer = (path) => {
  try {
    return require(path).default;
  } catch (e) {
    console.warn(`Reducer not found: ${path}`);
    return (state = null) => state;
  }
};

// Only load auth reducer directly - load others only when needed
const rootReducer = (state = {}, action) => {
  // Initialize with auth reducer
  if (!reducerMap.auth) {
    reducerMap.auth = getReducer('../features/auth/slices/authSlice');
  }
  
  // For other reducers, only load them when their state is accessed
  if (action.type && !action.type.startsWith('@@redux/INIT')) {
    const sliceName = action.type.split('/')[0];
    
    // Check if this slice reducer is loaded
    if (sliceName && sliceName !== 'auth' && !reducerMap[sliceName]) {
      try {
        const sliceMap = {
          'users': '../features/users/slices/usersSlice',
          'roles': '../features/roles/slices/rolesSlice',
          'branches': '../features/branches/slices/branchesSlice',
          'products': '../features/inventory/slices/productSlice',
          'customers': '../features/customers/slices/customerSlice',
          'purchases': '../features/purchases/slices/purchaseSlice',
          'sales': '../features/sales/slices/saleSlice',
          'transfers': '../features/transfers/slices/transferSlice',
          'dashboard': '../features/dashboard/slices/dashboardSlice',
          'reports': '../features/reports/slices/reportSlice',
          'notifications': '../features/notifications/slices/notificationSlice',
          'audit': '../features/audit/slices/auditSlice'
        };
        
        if (sliceMap[sliceName]) {
          reducerMap[sliceName] = getReducer(sliceMap[sliceName]);
        }
      } catch (e) {
        // Silently fail
      }
    }
  }

  // Combine all loaded reducers
  const combinedReducers = combineReducers(reducerMap);
  return combinedReducers(state, action);
};

export default rootReducer;
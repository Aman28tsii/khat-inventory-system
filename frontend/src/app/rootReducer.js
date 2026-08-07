import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import usersReducer from '../features/users/slices/usersSlice';
import rolesReducer from '../features/roles/slices/rolesSlice';
import branchesReducer from '../features/branches/slices/branchesSlice';
import productReducer from '../features/inventory/slices/productSlice';
import customersReducer from '../features/customers/slices/customerSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  roles: rolesReducer,
  branches: branchesReducer,
  products: productReducer,
  customers: customersReducer,
});

export default rootReducer;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AppLayout from '../components/layout/AppLayout/AppLayout';

// Auth Pages
import Login from '../features/auth/pages/Login';

// Dashboard
import ExecutiveDashboard from '../features/dashboard/pages/ExecutiveDashboard';

// User Management
import UserList from '../features/users/pages/UserList';

// Role Management
import RoleList from '../features/roles/pages/RoleList';

// Branch Management
import BranchList from '../features/branches/pages/BranchList';

// Inventory Management
import ProductList from '../features/inventory/pages/ProductList';
import BatchList from '../features/inventory/pages/BatchList';

// Supplier Management
import SupplierList from '../features/suppliers/pages/SupplierList';

// Customer Management
import CustomerList from '../features/customers/pages/CustomerList';

// Purchase Management
import PurchaseList from '../features/purchases/pages/PurchaseList';
import CreatePurchase from '../features/purchases/pages/CreatePurchase';
import PurchaseDetail from '../features/purchases/pages/PurchaseDetail';

// Sales Management
import SaleList from '../features/sales/pages/SaleList';
import CreateSale from '../features/sales/pages/CreateSale';
import SaleDetail from '../features/sales/pages/SaleDetail';

// Transfer Management
import TransferList from '../features/transfers/pages/TransferList';
import CreateTransfer from '../features/transfers/pages/CreateTransfer';
import TransferDetail from '../features/transfers/pages/TransferDetail';

// Reports
import InventoryReport from '../features/reports/pages/InventoryReport';
import SalesReport from '../features/reports/pages/SalesReport';

// Notifications
import NotificationCenter from '../features/notifications/pages/NotificationCenter';

// Audit Logs
import AuditLogs from '../features/audit/pages/AuditLogs';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<ExecutiveDashboard />} />
          <Route path="/dashboard" element={<ExecutiveDashboard />} />
          
          {/* User Management */}
          <Route path="/users" element={<UserList />} />
          
          {/* Role Management */}
          <Route path="/roles" element={<RoleList />} />
          
          {/* Branch Management */}
          <Route path="/branches" element={<BranchList />} />
          
          {/* Inventory Management */}
          <Route path="/inventory/products" element={<ProductList />} />
          <Route path="/inventory/batches" element={<BatchList />} />
          
          {/* Supplier Management */}
          <Route path="/suppliers" element={<SupplierList />} />
          
          {/* Customer Management */}
          <Route path="/customers" element={<CustomerList />} />
          
          {/* Purchase Management */}
          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/purchases/create" element={<CreatePurchase />} />
          <Route path="/purchases/:id" element={<PurchaseDetail />} />
          <Route path="/purchases/:id/edit" element={<CreatePurchase />} />
          
          {/* Sales Management */}
          <Route path="/sales" element={<SaleList />} />
          <Route path="/sales/create" element={<CreateSale />} />
          <Route path="/sales/:id" element={<SaleDetail />} />
          
          {/* Transfer Management */}
          <Route path="/transfers" element={<TransferList />} />
          <Route path="/transfers/create" element={<CreateTransfer />} />
          <Route path="/transfers/:id" element={<TransferDetail />} />
          <Route path="/transfers/:id/approve" element={<TransferDetail />} />
          <Route path="/transfers/:id/receive" element={<TransferDetail />} />
          
          {/* Reports */}
          <Route path="/reports/inventory" element={<InventoryReport />} />
          <Route path="/reports/sales" element={<SalesReport />} />
          
          {/* Notifications */}
          <Route path="/notifications" element={<NotificationCenter />} />
          
          {/* Audit Logs */}
          <Route path="/audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>
      
      {/* Fallback - Redirect to dashboard if route not found */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
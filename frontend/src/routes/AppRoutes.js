import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import Login from '../features/auth/pages/Login';
import ExecutiveDashboard from '../features/dashboard/pages/ExecutiveDashboard';
import BranchList from '../features/branches/pages/BranchList';
import ProductList from '../features/inventory/pages/ProductList';
import BatchList from '../features/inventory/pages/BatchList';
import CustomerList from '../features/customers/pages/CustomerList';
import SupplierList from '../features/suppliers/pages/SupplierList';
import PurchaseList from '../features/purchases/pages/PurchaseList';
import CreatePurchase from '../features/purchases/pages/CreatePurchase';
import PurchaseDetail from '../features/purchases/pages/PurchaseDetail';
import SaleList from '../features/sales/pages/SaleList';
import CreateSale from '../features/sales/pages/CreateSale';
import SaleDetail from '../features/sales/pages/SaleDetail';
import TransferList from '../features/transfers/pages/TransferList';
import CreateTransfer from '../features/transfers/pages/CreateTransfer';
import TransferDetail from '../features/transfers/pages/TransferDetail';
import UserList from '../features/users/pages/UserList';
import UserProfile from '../features/users/pages/UserProfile';
import RoleList from '../features/roles/pages/RoleList';
import AuditLogs from '../features/audit/pages/AuditLogs';
import NotificationCenter from '../features/notifications/pages/NotificationCenter';
import InventoryReport from '../features/reports/pages/InventoryReport';
import SalesReport from '../features/reports/pages/SalesReport';
import ProfitReport from '../features/reports/pages/ProfitReport';
import StockMovements from '../features/inventory/pages/StockMovements';
import SettingsPage from '../features/settings/pages/SettingsPage';
import ChangePassword from '../features/auth/pages/ChangePassword';
import AppLayout from '../components/layout/AppLayout/AppLayout';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<ExecutiveDashboard />} />
        <Route path="branches" element={<BranchList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="batches" element={<BatchList />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="suppliers" element={<SupplierList />} />
        <Route path="purchases" element={<PurchaseList />} />
        <Route path="purchases/create" element={<CreatePurchase />} />
        <Route path="purchases/:id" element={<PurchaseDetail />} />
        <Route path="sales" element={<SaleList />} />
        <Route path="sales/create" element={<CreateSale />} />
        <Route path="sales/:id" element={<SaleDetail />} />
        <Route path="transfers" element={<TransferList />} />
        <Route path="transfers/create" element={<CreateTransfer />} />
        <Route path="transfers/:id" element={<TransferDetail />} />
        <Route path="users" element={<UserList />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="roles" element={<RoleList />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="reports/inventory" element={<InventoryReport />} />
        <Route path="reports/sales" element={<SalesReport />} />
        <Route path="reports/profit" element={<ProfitReport />} />
        <Route path="inventory/stock-movements" element={<StockMovements />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Routes>
  );
};

export default AppRoutes;

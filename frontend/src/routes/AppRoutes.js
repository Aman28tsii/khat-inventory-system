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
import SaleList from '../features/sales/pages/SaleList';
import TransferList from '../features/transfers/pages/TransferList';
import UserList from '../features/users/pages/UserList';
import RoleList from '../features/roles/pages/RoleList';
import AuditLogs from '../features/audit/pages/AuditLogs';
import NotificationCenter from '../features/notifications/pages/NotificationCenter';
import InventoryReport from '../features/reports/pages/InventoryReport';
import SalesReport from '../features/reports/pages/SalesReport';
import ProfitReport from '../features/reports/pages/ProfitReport';
import StockMovements from '../features/inventory/pages/StockMovements';
import SettingsPage from '../features/settings/pages/SettingsPage';

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
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ExecutiveDashboard />} />
        <Route path="/branches" element={<BranchList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/batches" element={<BatchList />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/purchases" element={<PurchaseList />} />
        <Route path="/sales" element={<SaleList />} />
        <Route path="/transfers" element={<TransferList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/roles" element={<RoleList />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/reports/inventory" element={<InventoryReport />} />
        <Route path="/reports/sales" element={<SalesReport />} />
        <Route path="/reports/profit" element={<ProfitReport />} />
        <Route path="/inventory/stock-movements" element={<StockMovements />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;

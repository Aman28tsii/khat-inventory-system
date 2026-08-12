import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
      <Route path="/" element={<AppLayout><Navigate to="/dashboard" /></AppLayout>} />
      <Route path="/dashboard" element={<AppLayout><ExecutiveDashboard /></AppLayout>} />
      <Route path="/branches" element={<AppLayout><BranchList /></AppLayout>} />
      <Route path="/products" element={<AppLayout><ProductList /></AppLayout>} />
      <Route path="/batches" element={<AppLayout><BatchList /></AppLayout>} />
      <Route path="/customers" element={<AppLayout><CustomerList /></AppLayout>} />
      <Route path="/suppliers" element={<AppLayout><SupplierList /></AppLayout>} />
      <Route path="/purchases" element={<AppLayout><PurchaseList /></AppLayout>} />
      <Route path="/purchases/create" element={<AppLayout><CreatePurchase /></AppLayout>} />
      <Route path="/purchases/:id" element={<AppLayout><PurchaseDetail /></AppLayout>} />
      <Route path="/sales" element={<AppLayout><SaleList /></AppLayout>} />
      <Route path="/sales/create" element={<AppLayout><CreateSale /></AppLayout>} />
      <Route path="/sales/:id" element={<AppLayout><SaleDetail /></AppLayout>} />
      <Route path="/transfers" element={<AppLayout><TransferList /></AppLayout>} />
      <Route path="/transfers/create" element={<AppLayout><CreateTransfer /></AppLayout>} />
      <Route path="/transfers/:id" element={<AppLayout><TransferDetail /></AppLayout>} />
      <Route path="/users" element={<AppLayout><UserList /></AppLayout>} />
      <Route path="/profile" element={<AppLayout><UserProfile /></AppLayout>} />
      <Route path="/change-password" element={<AppLayout><ChangePassword /></AppLayout>} />
      <Route path="/roles" element={<AppLayout><RoleList /></AppLayout>} />
      <Route path="/audit-logs" element={<AppLayout><AuditLogs /></AppLayout>} />
      <Route path="/notifications" element={<AppLayout><NotificationCenter /></AppLayout>} />
      <Route path="/reports/inventory" element={<AppLayout><InventoryReport /></AppLayout>} />
      <Route path="/reports/sales" element={<AppLayout><SalesReport /></AppLayout>} />
      <Route path="/reports/profit" element={<AppLayout><ProfitReport /></AppLayout>} />
      <Route path="/inventory/stock-movements" element={<AppLayout><StockMovements /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
    </Routes>
  );
};

export default AppRoutes;




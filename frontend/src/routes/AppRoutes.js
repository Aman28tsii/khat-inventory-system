import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import RoleList from '../features/roles/pages/RoleList';
import AuditLogs from '../features/audit/pages/AuditLogs';
import NotificationCenter from '../features/notifications/pages/NotificationCenter';
import InventoryReport from '../features/reports/pages/InventoryReport';
import SalesReport from '../features/reports/pages/SalesReport';
import ProfitReport from '../features/reports/pages/ProfitReport';
import StockMovements from '../features/inventory/pages/StockMovements';
import SettingsPage from '../features/settings/pages/SettingsPage';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><ExecutiveDashboard /></ProtectedRoute>} />
      <Route path="/branches" element={<ProtectedRoute><BranchList /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
      <Route path="/batches" element={<ProtectedRoute><BatchList /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
      <Route path="/suppliers" element={<ProtectedRoute><SupplierList /></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><PurchaseList /></ProtectedRoute>} />
      <Route path="/purchases/create" element={<ProtectedRoute><CreatePurchase /></ProtectedRoute>} />
      <Route path="/purchases/:id" element={<ProtectedRoute><PurchaseDetail /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><SaleList /></ProtectedRoute>} />
      <Route path="/sales/create" element={<ProtectedRoute><CreateSale /></ProtectedRoute>} />
      <Route path="/sales/:id" element={<ProtectedRoute><SaleDetail /></ProtectedRoute>} />
      <Route path="/transfers" element={<ProtectedRoute><TransferList /></ProtectedRoute>} />
      <Route path="/transfers/create" element={<ProtectedRoute><CreateTransfer /></ProtectedRoute>} />
      <Route path="/transfers/:id" element={<ProtectedRoute><TransferDetail /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><RoleList /></ProtectedRoute>} />
      <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />
      <Route path="/reports/inventory" element={<ProtectedRoute><InventoryReport /></ProtectedRoute>} />
      <Route path="/reports/sales" element={<ProtectedRoute><SalesReport /></ProtectedRoute>} />
      <Route path="/reports/profit" element={<ProtectedRoute><ProfitReport /></ProtectedRoute>} />
      <Route path="/inventory/stock-movements" element={<ProtectedRoute><StockMovements /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;

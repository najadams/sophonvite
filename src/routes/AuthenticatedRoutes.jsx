import React, { lazy, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { PERMISSIONS } from "../context/userRoles";
import { useSelector } from "react-redux";
import SalesRoutes from "./sales/SalesRoutes";
import DebtsRoutes from "./debts/DebtsRoutes";
import Debt from "../views/Debt";

const Dashboard = lazy(() => import("../views/Dashboard"));
const Customers = lazy(() => import("../views/Customers"));
const ProductCatalogue = lazy(() => import("../views/ProductCatalogue"));
const StockEntry = lazy(() => import("../views/StockEntry"));
const InventoryReports = lazy(() => import("../views/InventoryReports"));
const Transactions = lazy(() => import("../views/Transactions"));
const Vendors = lazy(() => import("../views/Vendors"));
const Settings = lazy(() => import("../views/Settings"));
const CreateUser = lazy(() => import("../views/CreateUser"));
const WorkerEntry = lazy(() => import("../views/common/WorkerEntry"));
const NoPage = lazy(() => import("../views/NoPage"));
const MyAccount = lazy(() => import("../views/MyAccount"));
const Notifications = lazy(() => import("../views/Notifications"));

const AuthenticatedRoutes = () => {
  const isLoggedIn = useSelector((state) => state.companyState.isLoggedIn);
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={<Dashboard />}
        requiredPermissions={[PERMISSIONS.VIEW_DASHBOARD]}
      />
      <Route path="/products" element={<ProductCatalogue />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/!employee!@" element={<CreateUser />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/stocks" element={<StockEntry />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/inventory" element={<InventoryReports />} />
      <Route path="/debt/*" element={<DebtsRoutes />} />
      <Route
        path="/account"
        element={<WorkerEntry isLoggedIn={isLoggedIn} />}
      />
      <Route path="/sales/*" element={<SalesRoutes />} />
      <Route path="/myaccount/:accoutNumber" element={<MyAccount />} />
      <Route path="/notification" element={<Notifications />} />
      <Route path="/*" element={<NoPage />} />
    </Routes>
  );
};

export default AuthenticatedRoutes;
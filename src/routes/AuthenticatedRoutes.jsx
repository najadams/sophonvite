import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Dashboard = lazy(() => import("../views/Dashboard"));
const Customers = lazy(() => import("../views/Customers"));
const ProductCatalogue = lazy(() => import("../views/ProductCatalogue"));
const StockEntry = lazy(() => import("../views/StockEntry"));
const SalesOrders = lazy(() => import("../views/SalesOrders"));
const InventoryReports = lazy(() => import("../views/InventoryReports"));
const Transactions = lazy(() => import("../views/Transactions"));
const Vendors = lazy(() => import("../views/Vendors"));
const Settings = lazy(() => import("../views/Settings"));
const WorkerForm = lazy(() => import("../views/WorkerForm"));
const WorkerEntry = lazy(() => import("../views/WorkerEntry"));
const NoPage = lazy(() => import("../views/NoPage"));
const MyAccount = lazy(() => import("../views/MyAccount"))

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/products" element={<ProductCatalogue />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/!employee!@" element={<WorkerForm />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/stocks" element={<StockEntry />} />
    <Route path="/transactions" element={<Transactions />} />
    <Route path="/vendors" element={<Vendors />} />
    <Route path="/inventory" element={<InventoryReports />} />
    <Route path="/account" element={<WorkerEntry />} />
    <Route path="/sales" element={<SalesOrders />} />
    <Route path="/myaccount/:accoutNumber" element={MyAccount} />
    <Route path="/*" element={<NoPage />} />
  </Routes>
);

export default AuthenticatedRoutes;
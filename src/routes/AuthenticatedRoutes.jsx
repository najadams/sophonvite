import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { PERMISSIONS } from "../context/userRoles";

const Dashboard = lazy(() => import("../views/Dashboard"));
const Customers = lazy(() => import("../views/Customers"));
const ProductCatalogue = lazy(() => import("../views/ProductCatalogue"));
const StockEntry = lazy(() => import("../views/StockEntry"));
const SalesOrders = lazy(() => import("../views/SalesOrders"));
const InventoryReports = lazy(() => import("../views/InventoryReports"));
const Transactions = lazy(() => import("../views/Transactions"));
const Vendors = lazy(() => import("../views/Vendors"));
const Settings = lazy(() => import("../views/Settings"));
const CreateUser = lazy(() => import("../views/CreateUser"));
const WorkerEntry = lazy(() => import("../views/common/WorkerEntry"));
const NoPage = lazy(() => import("../views/NoPage"));
const MyAccount = lazy(() => import("../views/MyAccount"));

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/products" element={<ProductCatalogue />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/!employee!@" element={<CreateUser />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/stocks" element={<StockEntry />} />
    <Route path="/transactions" element={<Transactions />} />
    <Route path="/vendors" element={<Vendors />} />
    <Route path="/inventory" element={<InventoryReports />} />
    <Route path="/account" element={<WorkerEntry />} />
    <Route path="/sales" element={<SalesOrders />} />
    <Route path="/myaccount/:accoutNumber" element={<MyAccount />} />
    <Route path="/*" element={<NoPage />} />
  </Routes>
);

export default AuthenticatedRoutes;


// THIS IS THE FORMAT YOU SHOULD FOLLOW FOR THIS COMPONENT
// CHECK THE PERMISSION MAKE THE APPROPRIATE ADJUSTMENTS AND APPLY THEM
// const AuthenticatedRoutes = () => (
//   <>
//     <ProtectedRoute
//       path="/dashboard"
//       element={<Dashboard />}
//       requiredPermissions={[PERMISSIONS.VIEW_DASHBOARD]}
//     />
//     <ProtectedRoute
//       path="/manage-users"
//       element={<ManageUsers />}
//       requiredPermissions={[PERMISSIONS.MANAGE_USERS]}
//     />
//     <ProtectedRoute
//       path="/reports"
//       element={<Reports />}
//       requiredPermissions={[PERMISSIONS.VIEW_REPORTS]}
//     />
//   </>
// );
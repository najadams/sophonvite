import React, { lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import SalesRoutes from "./sales/SalesRoutes";
import DebtsRoutes from "./debts/DebtsRoutes";
import ReportsRoutes from "./reports/ReportsRoutes";
import VendorsRoutes from "./vendors/VendorsRoutes";
import ViewReceipt from "../views/ViewReceipt";
import { getPermissionsForRole } from "../context/userRoles";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../views/common/Unauthorized";

const Dashboard = lazy(() => import("../views/Dashboard"));
const Customers = lazy(() => import("../views/Customers"));
const ProductCatalogue = lazy(() => import("../views/ProductCatalogue"));
const StockEntry = lazy(() => import("../views/StockEntry"));
const Transactions = lazy(() => import("../views/Transactions"));
const Settings = lazy(() => import("../views/Settings"));
const CreateUser = lazy(() => import("../views/CreateUser"));
const WorkerEntry = lazy(() => import("../views/common/WorkerEntry"));
const NoPage = lazy(() => import("../views/NoPage"));
const MyAccount = lazy(() => import("../views/MyAccount"));
const Notifications = lazy(() => import("../views/Notifications"));

const AuthenticatedRoutes = () => {
  const userRole = useSelector((state) => state.userState?.currentUser.role);
  const isLoggedIn = useSelector((state) => state.companyState.isLoggedIn);
  console.log(userRole)
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role={userRole} requiredPermission="view_dashboard">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute role={userRole} requiredPermission="manage_inventory">
            <ProductCatalogue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute role={userRole} requiredPermission="manage_settings">
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/!employee!@"
        element={
          <ProtectedRoute role={userRole} requiredPermission="view_dashboard">
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute role={userRole} requiredPermission="view_dashboard">
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stocks"
        element={
          <ProtectedRoute role={userRole} requiredPermission="view_dashboard">
            <StockEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute role={userRole} requiredPermission="view_dashboard">
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendors/*"
        element={
          <ProtectedRoute role={userRole} requiredPermission="view_dashboard">
            <VendorsRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/debt/*"
        element={
          <ProtectedRoute role={userRole} requiredPermission="view_dashboard">
            <DebtsRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receipts/:receiptId"
        element={
          <ProtectedRoute role={userRole} requiredPermission="view_dashboard">
            <ViewReceipt />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={<WorkerEntry isLoggedIn={isLoggedIn} />}
      />
      <Route
        path="/sales/*"
        element={
          <ProtectedRoute role={userRole} requiredPermission="process_sales">
            <SalesRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/*"
        element={
          <ProtectedRoute role={userRole} requiredPermission="manage_payroll">
            <ReportsRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="/myaccount/:accoutNumber" element={<MyAccount />} />
      <Route path="/notification" element={<Notifications />} />
      <Route path="/not-authorized" element={<Unauthorized />} />
      <Route path="/*" element={<NoPage />} />
    </Routes>
  );
};

export default AuthenticatedRoutes;
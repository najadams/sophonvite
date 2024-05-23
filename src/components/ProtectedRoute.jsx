import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ element: Element, requiredPermissions, ...rest }) => {
  const { user } = useUser();

  const hasRequiredPermissions = requiredPermissions.every((permission) =>
    user.permissions.includes(permission)
  );

  return (
    <Route
      {...rest}
      element={
        hasRequiredPermissions ? <Element /> : <Navigate to="/unauthorized" />
      }
    />
  );
};

export default ProtectedRoute;

import React from "react";
import Unauthorized from "../views/common/Unauthorized";
import { getPermissionsForRole } from "../context/userRoles";

const ProtectedRoute = ({ role, requiredPermission, children }) => {
  const userPermissions = getPermissionsForRole(role);
  console.log(role)

  if (!userPermissions.includes(requiredPermission)) {
    // Redirect to a "Not Authorized" page or show an error message
    return <Unauthorized />;
  }

  return children;
};

export default ProtectedRoute;

import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element: Element, requiredPermissions, ...rest }) => {
  const user = useSelector((state) => state.userState.currentUser);
  console.log(user.permissions)

  if (!user) {
    // You may handle loading or unauthenticated state here
    return <Navigate to="/login" />;
  }

  // const hasRequiredPermissions = requiredPermissions.every((permission) =>
  //   user.permissions.includes(permission)
  // );

  return (
    <Route
      {...rest}
      element={
        <Element />
      }
      // hasRequiredPermissions ? <Element /> : <Navigate to="/unauthorized" />
    />
  );
};

export default ProtectedRoute;

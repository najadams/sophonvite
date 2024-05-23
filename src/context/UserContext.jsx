import React, { createContext, useContext, useState, useMemo } from "react";
import { ROLES, rolePermissions } from "./userRoles";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: ROLES.WORKER, // example role
    permissions: rolePermissions[ROLES.WORKER],
  });

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

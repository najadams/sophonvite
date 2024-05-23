export const ROLES = {
  SUPER_ADMIN: "super_admin",
  STORE_MANAGER: "store_manager",
  SALES_ASSOCIATE: "sales_associate",
  INVENTORY_MANAGER: "inventory_manager",
  HR: "hr",
  IT_SUPPORT: "it_support",
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  MANAGE_USERS: "manage_users",
  VIEW_REPORTS: "view_reports",
  MANAGE_INVENTORY: "manage_inventory",
  MANAGE_PAYROLL: "manage_payroll",
  MANAGE_SETTINGS: "manage_settings",
  PROCESS_SALES: "process_sales",
  // add more permissions as needed
};

export const rolePermissions = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.MANAGE_PAYROLL,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.PROCESS_SALES,
    // Super Admin has access to all permissions
  ],
  [ROLES.STORE_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.PROCESS_SALES,
    PERMISSIONS.MANAGE_SETTINGS,
    // Store Manager has access to store-level management permissions
  ],
  [ROLES.SALES_ASSOCIATE]: [
    PERMISSIONS.PROCESS_SALES,
    // Sales Associate can process sales transactions
  ],
  [ROLES.INVENTORY_MANAGER]: [
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.MANAGE_SETTINGS,
    // Inventory Manager can manage inventory
  ],
  [ROLES.HR]: [
    PERMISSIONS.MANAGE_PAYROLL,
    // HR can manage payroll and employee information
  ],
  [ROLES.IT_SUPPORT]: [
    PERMISSIONS.MANAGE_SETTINGS,
    // IT Support can manage technical settings
  ],
};

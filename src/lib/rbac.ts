/**
 * RBAC (Role-Based Access Control)
 * ================================
 * 4 Roles:
 * - citizen (مواطن): Upload shipments, view company listings
 * - collector (مجمع): Collect materials, manage pickup points
 * - company (شركة تدوير): Accept shipments, assign drivers, manage operations
 * - admin (المدير): Full platform access, user/shipment/platform logs
 */

export type AppRole = "admin" | "company" | "collector" | "citizen";

export const ADMIN_EMAIL = "barqaday@gmail.com";
export const ADMIN_VERIFIED_TOKENS: string[] = process.env.ADMIN_TOKENS?.split(",") || [];

/**
 * Route permissions matrix
 * Define which roles can access which routes
 */
export const ROUTE_PERMISSIONS: Record<string, AppRole[]> = {
  "/": ["admin", "company", "collector", "citizen"],
  "/auth": ["public"],
  "/admin": ["admin"],
  "/admin/*": ["admin"],
  "/company": ["company"],
  "/company/*": ["company"],
  "/collector": ["collector"],
  "/collector/*": ["collector"],
  "/citizen": ["citizen"],
  "/citizen/*": ["citizen"],
  "/map": ["company", "collector"],
};

/**
 * Data access policies
 * Prevent unauthorized data access between roles
 */
export const DATA_ACCESS_POLICIES = {
  // Citizens CANNOT access:
  citizen: {
    cannotAccess: [
      "driver_assignments",
      "company_operations",
      "platform_logs",
      "user_counts",
      "global_shipments",
      "analytics",
    ],
  },
  // Collectors CANNOT access:
  collector: {
    cannotAccess: [
      "company_revenue",
      "platform_logs",
      "user_counts",
      "analytics",
    ],
  },
  // Companies CANNOT access:
  company: {
    cannotAccess: [
      "platform_logs",
      "user_counts",
      "global_shipments",
      "admin_settings",
    ],
  },
};

/**
 * Check if user role can access route
 */
export function canAccessRoute(userRoles: AppRole[], route: string): boolean {
  const permittedRoles = ROUTE_PERMISSIONS[route];
  if (!permittedRoles) return false;
  if (permittedRoles.includes("public")) return true;
  return userRoles.some((role) => permittedRoles.includes(role));
}

/**
 * Check if user can access specific data
 */
export function canAccessData(
  userRoles: AppRole[],
  dataType: string
): boolean {
  const isAdmin = userRoles.includes("admin");
  if (isAdmin) return true;

  for (const role of userRoles) {
    const policy = DATA_ACCESS_POLICIES[role as keyof typeof DATA_ACCESS_POLICIES];
    if (policy?.cannotAccess.includes(dataType)) {
      return false;
    }
  }
  return true;
}

/**
 * Verify admin authentication
 * - Check if email is admin email
 * - Verify token if provided
 */
export function verifyAdminAccess(
  email: string | null,
  token?: string
): boolean {
  if (!email) return false;

  const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  if (!isAdminEmail) return false;

  // If token is provided, verify it
  if (token && ADMIN_VERIFIED_TOKENS.length > 0) {
    return ADMIN_VERIFIED_TOKENS.includes(token);
  }

  return isAdminEmail;
}

/**
 * Filter sensitive data based on user role
 */
export function filterSensitiveData<T extends Record<string, any>>(
  data: T,
  userRole: AppRole
): Partial<T> {
  const isAdmin = userRole === "admin";

  if (!isAdmin && userRole === "citizen") {
    // Citizens cannot see company operation details
    const filtered = { ...data };
    delete filtered.driver_assignments;
    delete filtered.company_operations;
    delete filtered.platform_logs;
    return filtered;
  }

  if (!isAdmin && userRole === "company") {
    // Companies cannot see platform-wide analytics
    const filtered = { ...data };
    delete filtered.platform_logs;
    delete filtered.global_analytics;
    return filtered;
  }

  return data;
}

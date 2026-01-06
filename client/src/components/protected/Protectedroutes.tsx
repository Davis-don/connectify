import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useTokenStore } from "../../../store/tokenStore";

interface RoleProtectedRouteProps {
  allowedRoles: string[];  // Roles allowed to access this route
  children: ReactNode;      // The page/component to render if allowed
  redirectPath?: string;    // Optional custom redirect path (default /login)
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
  redirectPath = "/login",
}) => {
  const { isAuthenticated, getRole } = useTokenStore();

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check role from store
  const role = getRole() || "";

  // Role not allowed → redirect to unauthorized page
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Role allowed → render the children
  return <>{children}</>;
};

export default RoleProtectedRoute;

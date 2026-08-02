import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useUserRole } from "./useUserRole";
import RoleOnboarding from "./RoleOnboarding";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const loc = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }
  if (!session) return <Navigate to="/auth" state={{ from: loc.pathname }} replace />;
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }
  if (!role) return <RoleOnboarding />;
  return children;
};

export default RequireAuth;

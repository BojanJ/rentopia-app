import { Navigate, useLocation } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import { useAuthStore } from "@/store/authStore";

interface ProtectedDashboardRouteProps {
  children: React.ReactNode;
}

export default function ProtectedDashboardRoute({ children }: ProtectedDashboardRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const { properties, isLoading, error } = useProperties();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Show loading state while fetching properties
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error("Error fetching properties:", error);
    // For now, we'll proceed to dashboard even on error
    // You might want to show an error page or retry logic here
  }

  // If user has no properties and is not already on empty state, redirect to empty state
  if (properties.length === 0 && location.pathname !== "/empty-state") {
    return <Navigate to="/empty-state" replace />;
  }

  // If user has properties and is on empty state, redirect to dashboard
  if (properties.length > 0 && location.pathname === "/empty-state") {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children (dashboard content)
  return <>{children}</>;
}

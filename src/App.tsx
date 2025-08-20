import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import EmptyStateLayout from "./layouts/EmptyStateLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import EmptyStatePage from "./pages/EmptyStatePage";
import ProtectedDashboardRoute from "./components/ProtectedDashboardRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

function App() {
  // Use the actual auth store instead of hardcoded state
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route index element={<Navigate to="/auth/login" replace />} />
          </Route>

          {/* Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedDashboardRoute>
                <DashboardLayout />
              </ProtectedDashboardRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            {/* You can add more dashboard routes here */}
            {/* <Route path="properties" element={<PropertiesPage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="maintenance" element={<MaintenancePage />} /> */}
          </Route>

          {/* Empty State Route */}
          <Route 
            path="/empty-state" 
            element={
              <ProtectedRoute>
                <EmptyStateLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmptyStatePage />} />
          </Route>

          {/* Root Route - Redirect based on auth status */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

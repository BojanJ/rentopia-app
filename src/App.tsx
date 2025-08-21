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

// Property Management Pages
import PropertiesPage from "./pages/Admin/Properties/PropertiesPage";
import AddPropertyPage from "./pages/Admin/Properties/AddPropertyPage";
import PropertyDetailsPage from "./pages/Admin/Properties/PropertyDetailsPage";
import EditPropertyPage from "./pages/Admin/Properties/EditPropertyPage";
import PropertySettingsPage from "./pages/Admin/Properties/PropertySettingsPage";
import BookingsPage from "./pages/Dashboard/BookingsPage";
import BookingsTestPage from "./pages/Dashboard/BookingsTestPage";

// Booking Management Pages
import BookingsListPage from "./pages/Admin/Bookings/BookingsListPage";
import AddBookingPage from "./pages/Admin/Bookings/AddBookingPage";
import EditBookingPage from "./pages/Admin/Bookings/EditBookingPage";
import BookingDetailsPage from "./pages/Admin/Bookings/BookingDetailsPage";

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
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings-test" element={<BookingsTestPage />} />
            {/* You can add more dashboard routes here */}
            {/* <Route path="properties" element={<PropertiesPage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="maintenance" element={<MaintenancePage />} /> */}
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="properties/add" element={<AddPropertyPage />} />
            <Route path="properties/:id" element={<PropertyDetailsPage />} />
            <Route path="properties/:id/edit" element={<EditPropertyPage />} />
            <Route path="properties/settings" element={<PropertySettingsPage />} />
            <Route path="bookings" element={<BookingsListPage />} />
            <Route path="bookings/add" element={<AddBookingPage />} />
            <Route path="bookings/:id" element={<BookingDetailsPage />} />
            <Route path="bookings/:id/edit" element={<EditBookingPage />} />
            <Route path="service-providers" element={<div>Service Providers (Coming Soon)</div>} />
            <Route path="settings/*" element={<div>Settings (Coming Soon)</div>} />
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

import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

interface EmptyStateLayoutProps {
  children?: React.ReactNode;
}

export default function EmptyStateLayout({ children }: EmptyStateLayoutProps) {
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900">Rentopia</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
}

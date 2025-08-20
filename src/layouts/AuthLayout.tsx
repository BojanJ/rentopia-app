import { Outlet } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Rentopia
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Property Management Platform
          </p>
        </div>
        <Card className="w-full">
          <CardContent className="p-6">
            {children || <Outlet />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

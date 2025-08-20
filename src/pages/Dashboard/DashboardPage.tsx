import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { usePropertyStore } from "@/store";

export default function DashboardPage() {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Properties",
      value: "142",
      description: "+12% from last month",
      icon: Home,
      trend: "up",
    },
    {
      title: "Active Tenants",
      value: "89",
      description: "+5% from last month",
      icon: Users,
      trend: "up",
    },
    {
      title: "Monthly Revenue",
      value: "$45,231",
      description: "+20% from last month",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Maintenance Requests",
      value: "23",
      description: "8 urgent",
      icon: AlertTriangle,
      trend: "neutral",
    },
  ];

  const recentActivities = [
    {
      type: "payment",
      tenant: "John Smith",
      property: "123 Main St",
      amount: "$1,200",
    },
    {
      type: "maintenance",
      tenant: "Sarah Johnson",
      property: "456 Oak Ave",
      issue: "Plumbing repair",
    },
    {
      type: "lease",
      tenant: "Mike Davis",
      property: "789 Pine St",
      status: "renewed",
    },
  ];

  const selectedProperty = usePropertyStore((state) => state.selectedProperty);

  return (
    <>
      {/* Stats Grid */}
      {selectedProperty?.id}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.tenant}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.property}
                    </p>
                  </div>
                  <div className="text-right">
                    {activity.type === "payment" && (
                      <Badge variant="default">{activity.amount}</Badge>
                    )}
                    {activity.type === "maintenance" && (
                      <Badge variant="destructive">{activity.issue}</Badge>
                    )}
                    {activity.type === "lease" && (
                      <Badge variant="secondary">Lease {activity.status}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/admin/properties/add")}
              >
                <Home className="mr-2 h-4 w-4" />
                Add New Property
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add New Tenant
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Properties Overview</CardTitle>
          <CardDescription>
            Status of all properties in your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Occupied</h4>
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-2 bg-green-600 rounded-full"
                  style={{ width: "62%" }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Vacant</h4>
              <div className="text-2xl font-bold text-yellow-600">32</div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-2 bg-yellow-600 rounded-full"
                  style={{ width: "23%" }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Under Maintenance</h4>
              <div className="text-2xl font-bold text-red-600">21</div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-2 bg-red-600 rounded-full"
                  style={{ width: "15%" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

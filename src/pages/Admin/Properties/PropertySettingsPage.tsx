import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  ArrowLeft,
  Building,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PropertySettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/properties")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Property Settings</h1>
          <p className="text-muted-foreground">
            Global settings and preferences for your properties
          </p>
        </div>
      </div>

      {/* Coming Soon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Default Property Settings
            </CardTitle>
            <CardDescription>
              Set default values for new properties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Coming Soon Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Default property type</li>
                <li>• Standard amenities list</li>
                <li>• Default house rules template</li>
                <li>• Standard check-in/out times</li>
              </ul>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Settings
            </CardTitle>
            <CardDescription>
              Configure pricing rules and defaults
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Coming Soon Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Default pricing structure</li>
                <li>• Seasonal rate templates</li>
                <li>• Dynamic pricing rules</li>
                <li>• Tax configuration</li>
              </ul>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Booking Settings
            </CardTitle>
            <CardDescription>
              Configure booking rules and restrictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Coming Soon Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Minimum/maximum stay requirements</li>
                <li>• Advance booking window</li>
                <li>• Cancellation policies</li>
                <li>• Instant booking settings</li>
              </ul>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guest Communication
            </CardTitle>
            <CardDescription>
              Configure guest communication templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Coming Soon Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Welcome message templates</li>
                <li>• Check-in instructions</li>
                <li>• Automated responses</li>
                <li>• Review request templates</li>
              </ul>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Property settings will allow you to configure global defaults and preferences 
            for all your properties. These features are currently under development.
          </p>
          <p className="text-sm text-muted-foreground">
            In the meantime, you can configure individual property settings when creating 
            or editing each property.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

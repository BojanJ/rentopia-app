import * as React from "react";
import {
  Home,
  Users,
  Wrench,
  DollarSign,
  BarChart3,
  Settings,
  Calendar,
  FileText,
  Bell,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { PropertySwitcher } from "@/components/property-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Rentopia property management data
const data = {
  // Property Management Menu - for managing the selected property
  propertyMenu: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Bookings",
      url: "/dashboard/bookings",
      icon: Calendar,
      items: [
        {
          title: "All Bookings",
          url: "/dashboard/bookings",
        },
        {
          title: "Check-ins Today",
          url: "/dashboard/bookings/checkins",
        },
        {
          title: "Check-outs Today",
          url: "/dashboard/bookings/checkouts",
        },
        {
          title: "New Booking",
          url: "/dashboard/bookings/new",
        },
      ],
    },
    {
      title: "Maintenance",
      url: "/dashboard/maintenance",
      icon: Wrench,
      items: [
        {
          title: "Active Requests",
          url: "/dashboard/maintenance",
        },
        {
          title: "Schedule Service",
          url: "/dashboard/maintenance/schedule",
        },
        {
          title: "Maintenance History",
          url: "/dashboard/maintenance/history",
        },
      ],
    },
    {
      title: "Pricing",
      url: "/dashboard/pricing",
      icon: DollarSign,
      items: [
        {
          title: "Rate Calendar",
          url: "/dashboard/pricing/calendar",
        },
        {
          title: "Seasonal Rates",
          url: "/dashboard/pricing/seasonal",
        },
        {
          title: "Special Offers",
          url: "/dashboard/pricing/offers",
        },
      ],
    },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: FileText,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
  ],
  // Admin Menu - for managing properties and service providers
  adminMenu: [
    {
      title: "Properties",
      url: "/admin/properties",
      icon: Home,
      items: [
        {
          title: "All Properties",
          url: "/admin/properties",
        },
        {
          title: "Add Property",
          url: "/admin/properties/add",
        },
        {
          title: "Property Settings",
          url: "/admin/properties/settings",
        },
      ],
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: Calendar,
      items: [
        {
          title: "All Bookings",
          url: "/admin/bookings",
        },
        {
          title: "Add Booking",
          url: "/admin/bookings/add",
        },
      ],
    },
    {
      title: "Service Providers",
      url: "/admin/service-providers",
      icon: Users,
      items: [
        {
          title: "All Providers",
          url: "/admin/service-providers",
        },
        {
          title: "Add Provider",
          url: "/admin/service-providers/add",
        },
        {
          title: "Provider Reviews",
          url: "/admin/service-providers/reviews",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/admin/settings/profile",
        },
        {
          title: "Preferences",
          url: "/admin/settings/preferences",
        },
        {
          title: "Integrations",
          url: "/admin/settings/integrations",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PropertySwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* Property Management Menu */}
        <NavMain items={data.propertyMenu} title="Property Management" />
        
        {/* Separator */}
        <div className="px-4 py-2">
          <Separator />
        </div>
        
        {/* Admin Menu */}
        <NavMain items={data.adminMenu} title="Administration" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

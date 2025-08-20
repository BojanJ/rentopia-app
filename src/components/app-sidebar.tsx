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
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { PropertySwitcher } from "@/components/property-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Rentopia property management data
const data = {
  user: {
    name: "Property Manager",
    email: "manager@rentopia.com",
    avatar: "/avatars/manager.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Properties",
      url: "/dashboard/properties",
      icon: Home,
      items: [
        {
          title: "All Properties",
          url: "/dashboard/properties",
        },
        {
          title: "Vacant Units",
          url: "/dashboard/properties/vacant",
        },
        {
          title: "Add Property",
          url: "/dashboard/properties/add",
        },
      ],
    },
    {
      title: "Tenants",
      url: "/dashboard/tenants",
      icon: Users,
      items: [
        {
          title: "All Tenants",
          url: "/dashboard/tenants",
        },
        {
          title: "Lease Renewals",
          url: "/dashboard/tenants/renewals",
        },
        {
          title: "Applications",
          url: "/dashboard/tenants/applications",
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
          title: "Service Providers",
          url: "/dashboard/maintenance/providers",
        },
      ],
    },
    {
      title: "Financials",
      url: "/dashboard/financials",
      icon: DollarSign,
      items: [
        {
          title: "Rent Collection",
          url: "/dashboard/financials/rent",
        },
        {
          title: "Expenses",
          url: "/dashboard/financials/expenses",
        },
        {
          title: "Reports",
          url: "/dashboard/financials/reports",
        },
      ],
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
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
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Preferences",
          url: "/dashboard/settings/preferences",
        },
        {
          title: "Integrations",
          url: "/dashboard/settings/integrations",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Property Reports",
      url: "/dashboard/reports",
      icon: FileText,
    },
    {
      name: "Maintenance Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Tenant Portal",
      url: "/dashboard/portal",
      icon: Users,
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

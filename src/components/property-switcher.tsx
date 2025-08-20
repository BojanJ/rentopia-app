import {
  Bath,
  BedDouble,
  Building2,
  ChevronsUpDown,
  Home,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProperties } from "@/hooks/useProperties";
import { type Property } from "@/store/propertyStore";

// Icon mapping for different property types
const getPropertyIcon = (propertyType: Property["propertyType"]) => {
  switch (propertyType) {
    case "apartment":
    case "condo":
    case "studio":
      return Building2;
    case "house":
    case "townhouse":
      return Home;
    default:
      return Building2;
  }
};

// Helper to get property display info
const getPropertyDisplayInfo = (property: Property) => {
  const Icon = getPropertyIcon(property.propertyType);
  const location = `${property.city}, ${property.state}`;
  // Instead of a string, return an array of occupancy info for icon rendering
  const occupancy = [
    { icon: BedDouble, value: property.bedrooms, label: "Bedrooms" },
    { icon: Bath, value: property.bathrooms, label: "Bathrooms" },
    { icon: Users, value: property.maxOccupancy, label: "Guests" },
  ];

  return {
    Icon,
    location,
    occupancy,
  };
};

export function PropertySwitcher() {
  const { isMobile } = useSidebar();

  // Use the properties hook to load data and get selected property management
  const { activeProperties, isLoading, selectedProperty, setSelectedProperty } =
    useProperties();

  // Auto-select first property if none selected and properties exist
  React.useEffect(() => {
    if (
      !selectedProperty &&
      Array.isArray(activeProperties) &&
      activeProperties.length > 0
    ) {
      setSelectedProperty(activeProperties[0]);
    }
  }, [selectedProperty, activeProperties, setSelectedProperty]);

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            disabled
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building2 className="size-4 animate-pulse" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading...</span>
              <span className="truncate text-xs text-muted-foreground">
                Loading properties
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (
    !selectedProperty &&
    (!Array.isArray(activeProperties) || activeProperties.length === 0)
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Plus className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Add Property</span>
              <span className="truncate text-xs text-muted-foreground">
                No properties yet
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!selectedProperty) {
    return null;
  }

  const { Icon, location } = getPropertyDisplayInfo(selectedProperty);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {selectedProperty.name}
                </span>
                <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" />
                  {location}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Properties (
              {Array.isArray(activeProperties) ? activeProperties.length : 0})
            </DropdownMenuLabel>
            {Array.isArray(activeProperties) &&
              activeProperties.map((property, index) => {
                const {
                  Icon: PropertyIcon,
                  location: propertyLocation,
                  occupancy: propertyOccupancy,
                } = getPropertyDisplayInfo(property);
                const isSelected = selectedProperty?.id === property.id;

                return (
                  <DropdownMenuItem
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className={`gap-2 p-3 ${isSelected ? "bg-accent" : ""}`}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <PropertyIcon className="size-3.5 shrink-0" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="truncate font-medium">
                        {property.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" />
                        {propertyLocation}
                      </span>
                      <span className="truncate text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        {propertyOccupancy.map((item) => (
                          <span
                            key={item.label}
                            className="flex items-center gap-0.5"
                          >
                            <item.icon className="size-3" />
                            {item.value}
                          </span>
                        ))}
                      </span>
                    </div>
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                );
              })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-3">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add property
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

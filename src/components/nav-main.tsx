"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  title = "Platform"
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  title?: string
}) {
  const location = useLocation();

  // Function to check if a route is active
  const isRouteActive = (url: string): boolean => {
    // Exact match
    if (location.pathname === url) return true;
    
    // For non-root paths, check if it's a sub-path but not if it would create false positives
    // e.g., /dashboard should not match /dashboard/bookings
    if (url === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    
    // For other paths, check if it starts with the URL followed by a slash
    return location.pathname.startsWith(url + '/');
  };

  // Function to check if any sub-item is active
  const hasActiveSubItem = (items?: { url: string; title: string }[]): boolean => {
    if (!items) return false;
    return items.some(subItem => isRouteActive(subItem.url));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Check if item has sub-items to determine if it should be collapsible
          const hasSubItems = item.items && item.items.length > 0;
          const isActive = isRouteActive(item.url);
          const hasActiveSub = hasActiveSubItem(item.items);

          if (hasSubItems) {
            // Render collapsible item with sub-items
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive || hasActiveSub}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={isActive || hasActiveSub}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isRouteActive(subItem.url)}>
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          } else {
            // Render simple navigation item without collapsible behavior
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

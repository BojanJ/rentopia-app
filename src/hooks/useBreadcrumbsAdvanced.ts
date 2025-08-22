import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useProperties } from './useProperties';
import { useBooking } from './useBookingApi';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface RouteConfig {
  label: string;
  getDynamicLabel?: (params: Record<string, string>, data?: any) => string;
  useEntityData?: (params: Record<string, string>) => any;
}

// Define route configurations for breadcrumb generation
const routeConfig: Record<string, RouteConfig> = {
  // Root routes
  '/': { label: 'Home' },
  
  // Dashboard routes
  '/dashboard': { label: 'Dashboard' },
  '/dashboard/bookings': { label: 'Bookings' },
  '/dashboard/bookings-test': { label: 'Bookings Test' },
  
  // Admin routes
  '/admin': { label: 'Admin' },
  '/admin/properties': { label: 'Properties' },
  '/admin/properties/add': { label: 'Add Property' },
  '/admin/properties/settings': { label: 'Property Settings' },
  '/admin/bookings': { label: 'Bookings' },
  '/admin/bookings/add': { label: 'Add Booking' },
  '/admin/service-providers': { label: 'Service Providers' },
  '/admin/settings': { label: 'Settings' },
  
  // Dynamic routes with parameters
  '/admin/properties/:id': { 
    label: 'Property Details',
    getDynamicLabel: (params, data) => {
      const property = data?.properties?.find((p: any) => p.id === params.id);
      return property ? property.name : `Property ${params.id}`;
    },
    useEntityData: () => {
      const { properties } = useProperties();
      return { properties };
    }
  },
  '/admin/properties/:id/edit': { 
    label: 'Edit Property',
    getDynamicLabel: (params, data) => {
      const property = data?.properties?.find((p: any) => p.id === params.id);
      return property ? `Edit ${property.name}` : `Edit Property ${params.id}`;
    },
    useEntityData: () => {
      const { properties } = useProperties();
      return { properties };
    }
  },
  '/admin/bookings/:id': { 
    label: 'Booking Details',
    getDynamicLabel: (params, data) => {
      const booking = data?.booking;
      return booking ? `Booking - ${booking.guestName}` : `Booking ${params.id}`;
    },
    useEntityData: (params) => {
      const { data: booking } = useBooking(params.id, !!params.id);
      return { booking };
    }
  },
  '/admin/bookings/:id/edit': { 
    label: 'Edit Booking',
    getDynamicLabel: (params, data) => {
      const booking = data?.booking;
      return booking ? `Edit - ${booking.guestName}` : `Edit Booking ${params.id}`;
    },
    useEntityData: (params) => {
      const { data: booking } = useBooking(params.id, !!params.id);
      return { booking };
    }
  },
  
  // Auth routes
  '/auth': { label: 'Authentication' },
  '/auth/login': { label: 'Login' },
  '/auth/register': { label: 'Register' },
  
  // Other routes
  '/empty-state': { label: 'Getting Started' },
};

// Helper function to match dynamic routes
function matchRoute(pathname: string, routePattern: string): boolean {
  const pathSegments = pathname.split('/').filter(Boolean);
  const patternSegments = routePattern.split('/').filter(Boolean);
  
  if (pathSegments.length !== patternSegments.length) {
    return false;
  }
  
  return patternSegments.every((segment, index) => {
    return segment.startsWith(':') || segment === pathSegments[index];
  });
}

// Helper function to extract parameters from dynamic routes
function extractParams(pathname: string, routePattern: string): Record<string, string> {
  const pathSegments = pathname.split('/').filter(Boolean);
  const patternSegments = routePattern.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  
  patternSegments.forEach((segment, index) => {
    if (segment.startsWith(':')) {
      const paramName = segment.slice(1);
      params[paramName] = pathSegments[index];
    }
  });
  
  return params;
}

export function useBreadcrumbsAdvanced(): BreadcrumbItem[] {
  const location = useLocation();
  const params = useParams();
  
  return useMemo(() => {
    const pathname = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always start with the home/root breadcrumb
    breadcrumbs.push({
      label: 'Rentopia',
      href: '/',
    });
    
    // Split pathname into segments and build breadcrumbs
    const segments = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLastSegment = index === segments.length - 1;
      
      // First, try to find exact match
      let routeInfo = routeConfig[currentPath];
      let extractedParams = params;
      let entityData = null;
      
      // If no exact match, try to match dynamic routes
      if (!routeInfo) {
        for (const [pattern, config] of Object.entries(routeConfig)) {
          if (matchRoute(currentPath, pattern)) {
            routeInfo = config;
            extractedParams = extractParams(currentPath, pattern);
            // Note: entityData would need to be handled differently in a real implementation
            // since hooks can't be called conditionally. For now, we'll use basic labels.
            break;
          }
        }
      }
      
      // Generate label
      let label = routeInfo?.label || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Use dynamic label if available
      if (routeInfo?.getDynamicLabel && extractedParams) {
        label = routeInfo.getDynamicLabel(extractedParams as Record<string, string>, entityData);
      }
      
      // Add breadcrumb item
      breadcrumbs.push({
        label,
        href: isLastSegment ? undefined : currentPath,
        isCurrentPage: isLastSegment,
      });
    });
    
    return breadcrumbs;
  }, [location.pathname, params]);
}

export default useBreadcrumbsAdvanced;

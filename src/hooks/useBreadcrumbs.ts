import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { breadcrumbConfig } from '@/config/breadcrumbConfig';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

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

export function useBreadcrumbs(): BreadcrumbItem[] {
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
    
    // Special case for root path
    if (pathname === '/') {
      return breadcrumbs;
    }
    
    // Split pathname into segments and build breadcrumbs
    const segments = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLastSegment = index === segments.length - 1;
      
      // First, try to find exact match
      let routeInfo = breadcrumbConfig[currentPath as keyof typeof breadcrumbConfig];
      let extractedParams = params;
      
      // If no exact match, try to match dynamic routes
      if (!routeInfo) {
        for (const [pattern, config] of Object.entries(breadcrumbConfig)) {
          if (matchRoute(currentPath, pattern)) {
            routeInfo = config;
            extractedParams = extractParams(currentPath, pattern);
            break;
          }
        }
      }
      
      // Generate label
      let label = routeInfo?.label || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Use dynamic label if available
      if (routeInfo?.getDynamicLabel && extractedParams) {
        label = routeInfo.getDynamicLabel(extractedParams as Record<string, string>);
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

export default useBreadcrumbs;

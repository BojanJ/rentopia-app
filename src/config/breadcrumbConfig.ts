// Breadcrumb configuration for the application
export const breadcrumbConfig: Record<string, { 
  label: string; 
  getDynamicLabel?: (params: Record<string, string>) => string;
}> = {
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
    getDynamicLabel: (params: Record<string, string>) => `Property ${params.id}`
  },
  '/admin/properties/:id/edit': { 
    label: 'Edit Property',
    getDynamicLabel: (params: Record<string, string>) => `Edit Property ${params.id}`
  },
  '/admin/bookings/:id': { 
    label: 'Booking Details',
    getDynamicLabel: (params: Record<string, string>) => `Booking ${params.id}`
  },
  '/admin/bookings/:id/edit': { 
    label: 'Edit Booking',
    getDynamicLabel: (params: Record<string, string>) => `Edit Booking ${params.id}`
  },
  
  // Auth routes
  '/auth': { label: 'Authentication' },
  '/auth/login': { label: 'Login' },
  '/auth/register': { label: 'Register' },
  
  // Other routes
  '/empty-state': { label: 'Getting Started' },
};

// Generic pagination types
export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Alternative structure if the API returns the data directly in a named property
export interface PaginatedResponseWithKey<T> {
  [key: string]: T[] | PaginationMeta;
  pagination: PaginationMeta;
}

// Query parameters for pagination
export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
}

// Helper function to build pagination query params
export const buildPaginationParams = (params: PaginationParams = {}): URLSearchParams => {
  const searchParams = new URLSearchParams();
  
  if (params.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }
  
  if (params.offset !== undefined) {
    searchParams.append('offset', params.offset.toString());
  }
  
  if (params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  
  return searchParams;
};

// Helper function to calculate page-based pagination
export const calculatePagination = (page: number = 1, limit: number = 50) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

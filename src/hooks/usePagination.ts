import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useState } from 'react';
import type { PaginationParams, PaginatedResponse } from '../types/pagination';

// Generic pagination hook interface
export interface UsePaginatedQueryOptions<T, E = Error> {
  queryKey: (pagination: PaginationParams) => readonly unknown[];
  queryFn: (pagination: PaginationParams) => Promise<T>;
  initialPagination?: PaginationParams;
  enabled?: boolean;
  staleTime?: number;
  queryOptions?: Omit<UseQueryOptions<T, E>, 'queryKey' | 'queryFn' | 'enabled'>;
}

// Generic pagination hook
export const usePaginatedQuery = <T, E = Error>({
  queryKey,
  queryFn,
  initialPagination = { limit: 50, offset: 0 },
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  queryOptions,
}: UsePaginatedQueryOptions<T, E>) => {
  const [pagination, setPagination] = useState<PaginationParams>(initialPagination);

  const query = useQuery({
    queryKey: queryKey(pagination),
    queryFn: () => queryFn(pagination),
    enabled,
    staleTime,
    ...queryOptions,
  });

  // Pagination helpers
  const goToPage = (page: number) => {
    const limit = pagination.limit || 50;
    const offset = (page - 1) * limit;
    setPagination(prev => ({ ...prev, offset, page }));
  };

  const nextPage = () => {
    const limit = pagination.limit || 50;
    const currentOffset = pagination.offset || 0;
    setPagination(prev => ({ 
      ...prev, 
      offset: currentOffset + limit,
      page: Math.floor(currentOffset / limit) + 2 
    }));
  };

  const prevPage = () => {
    const limit = pagination.limit || 50;
    const currentOffset = pagination.offset || 0;
    const newOffset = Math.max(0, currentOffset - limit);
    setPagination(prev => ({ 
      ...prev, 
      offset: newOffset,
      page: Math.floor(newOffset / limit) + 1 
    }));
  };

  const setPageSize = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, offset: 0, page: 1 }));
  };

  // Calculate current page info
  const limit = pagination.limit || 50;
  const offset = pagination.offset || 0;
  const currentPage = Math.floor(offset / limit) + 1;

  return {
    ...query,
    pagination,
    setPagination,
    currentPage,
    pageSize: limit,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
};

// Hook specifically for arrays with pagination metadata
export interface UsePaginatedArrayOptions<T, E = Error> extends Omit<UsePaginatedQueryOptions<PaginatedResponse<T>, E>, 'queryFn'> {
  queryFn: (pagination: PaginationParams) => Promise<PaginatedResponse<T>>;
}

export const usePaginatedArray = <T, E = Error>(options: UsePaginatedArrayOptions<T, E>) => {
  const result = usePaginatedQuery(options);
  
  return {
    ...result,
    data: result.data?.data,
    paginationMeta: result.data?.pagination,
    hasNextPage: result.data?.pagination.hasMore || false,
    hasPrevPage: (result.pagination.offset || 0) > 0,
  };
};

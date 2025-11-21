import { useEffect, useState } from 'react';
import { useDeleteRequestMutation, useRequestsQuery } from './api';
import { GetRequestsParams } from './types';

export function useRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(5);

  const itemsPerPage = 5;

  const params: GetRequestsParams = {
    search: searchQuery,
    sortOrder,
    page: currentPage,
    limit: itemsPerPage,
  };
  const {
    data,
    isLoading,
    error,
    refetch
  } = useRequestsQuery(params);

  useEffect(() => {
    if (typeof data?.meta?.totalCount === 'number') {
      setTotalCount(data.meta.totalCount);
    } else {
      setTotalCount(0);
    }
  }, [data?.meta?.totalCount]);

  return {
    requests: data?.data || [],        
    totalCount: data?.meta?.totalCount || 0,
    isLoading,
    error,

    mutate: refetch,                  

    filters: {
      currentPage,
      setCurrentPage,
      searchQuery,
      setSearchQuery,
      sortOrder,
      setSortOrder,
      itemsPerPage,
      totalCount,
    },
  };
}


export function useDeleteRequest() {
  const deleteRequestMutation = useDeleteRequestMutation();

  return {
    deleteRequest: deleteRequestMutation.mutateAsync,
  };
}
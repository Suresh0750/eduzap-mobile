import { useEffect, useState } from 'react';
import { useRequestsQuery } from './api';
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
    console.log("server data", data);
  }, [data]);

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

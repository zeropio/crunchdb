import { useState, useCallback } from 'react';
import { DataItem } from '../types';

interface SearchResponse {
  results: DataItem[];
  pagination: {
    current: number;
    total: number;
    totalItems: number;
  };
}

export const useSearch = () => {
  const [results, setResults] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<SearchResponse['pagination'] | null>(null);

  const search = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setResults([]);
      setPagination(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        q: query.trim(),
        page: page.toString(),
        limit: '100'
      });

      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data: SearchResponse = await response.json();
      setResults(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error');
      setResults([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    pagination,
    search
  };
};
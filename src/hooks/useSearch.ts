import { useMemo } from 'react';
import { DataItem } from '../types';

export const useSearch = (search: string, data: DataItem[]) => {
  const results = useMemo(() => {
    if (!search.trim()) {
      return [];
    }

    const searchLower = search.toLowerCase().trim();
    
    const filtered = data.filter(item => {
    const regex = new RegExp(`\\b${searchLower}\\b`, 'i');
    return (
      regex.test(item.hex) ||
      regex.test(item.name) ||
      regex.test(item.type) ||
      regex.test(item.source)
    );
  });

    return filtered;
  }, [data, search]);

  const hasSearched = useMemo(() => {
    return search.trim().length > 0;
  }, [search]);

  return {
    results,
    hasSearched,
  };
};
import { useState, useEffect } from 'react';
import { DataItem } from '../types';

export const useSearch = (search: string, data: DataItem[]) => {
  const [results, setResults] = useState<DataItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      const searchLower = search.toLowerCase();
      const filtered = data.filter(item => {
        return (
          String(item.id) === search ||
          item.hex.toLowerCase().includes(searchLower) ||
          item.name_source_pairs.some(pair => 
            pair.name.toLowerCase().includes(searchLower) ||
            pair.source.toLowerCase().includes(searchLower)
          )
        );
      });

      setResults(filtered);
      setHasSearched(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, data]);

  return { results, hasSearched };
};
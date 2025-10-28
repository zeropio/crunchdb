import { useState, useEffect } from 'react';
import { DataItem } from '../types';

export const useDataLoader = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load the file list first
        console.log('Loading file list...');
        const fileListResponse = await fetch('/data/file-list.json');
        
        if (!fileListResponse.ok) {
          throw new Error('File list not found');
        }
        
        const jsonFiles = await fileListResponse.json();
        console.log(`Found ${jsonFiles.length} files to load`);
        setProgress({ loaded: 0, total: jsonFiles.length });

        let allData: DataItem[] = [];
        const batchSize = 5; // Reduce batch size for memory management
        
        for (let i = 0; i < jsonFiles.length; i += batchSize) {
          const batch = jsonFiles.slice(i, i + batchSize);
          
          const batchPromises = batch.map(async (filename: string) => {
            try {
              const fileResponse = await fetch(`/data/${filename}`);
              if (fileResponse.ok) {
                const responseText = await fileResponse.text();
                const jsonData = JSON.parse(responseText);
                return Array.isArray(jsonData) ? jsonData : [jsonData];
              }
              return [];
            } catch (err) {
              console.warn(`Error loading ${filename}:`, err);
              return [];
            }
          });
          
          const batchResults = await Promise.all(batchPromises);
          const batchData = batchResults.flat();
          
          // Update state incrementally to avoid stack overflow
          allData = [...allData, ...batchData];
          setData(allData); // Update state with current progress
          
          setProgress({ loaded: Math.min(i + batchSize, jsonFiles.length), total: jsonFiles.length });

          // Add a small delay to prevent overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, progress };
};
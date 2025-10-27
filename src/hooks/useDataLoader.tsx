import { useState, useEffect } from 'react';
import { DataItem } from '../types';

export const useDataLoader = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allData: DataItem[] = [];
        
        const jsonFiles = ['xnu.json'];
        
        for (const filename of jsonFiles) {
          try {
            console.log(`Loading: /data/${filename}`);
            const response = await fetch(`/data/${filename}`);
            console.log(`Status:`, response.status);
            
            if (response.ok) {
              const responseText = await response.text();              
              try {
                const jsonData = JSON.parse(responseText);
                allData.push(...(Array.isArray(jsonData) ? jsonData : [jsonData]));
              } catch (parseError) {
                console.error(`JSON error:`, parseError);
              }
            } else {
              console.warn(`Failed: ${response.status}`);
            }
          } catch (err) {
            console.warn(`Error:`, err);
          }
        }
        
        setData(allData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};
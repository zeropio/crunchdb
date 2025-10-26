import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

interface NameSourcePair {
  name: string;
  source: string;
}

interface DataItem {
  id: number;
  hex: string;
  name_source_pairs: NameSourcePair[];
}

function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<DataItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tailwind = document.createElement('link');
    tailwind.href = 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css';
    tailwind.rel = 'stylesheet';
    document.head.appendChild(tailwind);

    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allData: DataItem[] = [];
        
        const jsonFiles = ['test.json'];
        
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-32">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            CrunchDB
          </h1>
          <p className="text-xl text-gray-400">
            Apple's Magic Number DataBase
          </p>
          {!loading && (
            <p className="text-sm text-gray-500 mt-2">
              {data.length} items loaded
            </p>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-6 py-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            disabled={loading}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        {loading && (
          <div className="mt-8 text-center text-gray-400">
            Loading data...
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-750 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Balue</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Hex value</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
                </tr>
              </thead>
              <tbody>
                {results.map(item => (
                  <React.Fragment key={item.id}>
                    {item.name_source_pairs.map((pair, index) => (
                      <tr 
                        key={`${item.id}-${index}`} 
                        className="border-b border-gray-700 last:border-b-0 hover:bg-gray-750"
                      >
                        <td className="px-4 py-3 text-white">{pair.name}</td>
                        <td className="px-4 py-3 text-gray-300">{item.id}</td>
                        <td className="px-4 py-3 text-blue-400 font-mono">{item.hex}</td>
                        <td className="px-4 py-3 text-blue-400 font-mono">{pair.source}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasSearched && search && results.length === 0 && (
          <div className="mt-8 text-center text-gray-400">
            No results found for "{search}"
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';

interface DataItem {
  id: number;
  hex: string;
  names: string[];
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
              console.log(`Raw:`, responseText);
              
              try {
                const jsonData = JSON.parse(responseText);
                console.log(`Parsed:`, jsonData);
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
        
        console.log('All data:', allData);
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
          item.names.some(name => name.toLowerCase().includes(searchLower))
        );
      });

      console.log('Search results for:', search, filtered);
      setResults(filtered);
      setHasSearched(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, data]);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-xl font-semibold text-white">CrunchDB</div>
            <nav className="flex space-x-6">
              <a href="#" className="text-sm text-gray-300 hover:text-white">
                <i className="fas fa-question-circle mr-2"></i>What am I looking at?
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white">
                <i className="fas fa-globe mr-2"></i>Website
              </a>
            </nav>
          </div>
        </div>
      </header>

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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Hex value</th>
                </tr>
              </thead>
              <tbody>
                {results.map(item => (
                  <tr key={item.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-750">
                    <td className="px-4 py-3 text-white">{item.names.join(', ')}</td>
                    <td className="px-4 py-3 text-gray-300">{item.id}</td>
                    <td className="px-4 py-3 text-blue-400 font-mono">{item.hex}</td>
                  </tr>
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

        <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-500">
          <p>© 2025 Crunch Doing Re. Based on the amazing <u><a target="_blank" href="https://www.magnumdb.com/">MagnumDB</a></u>.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
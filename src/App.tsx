import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchResultsTable } from './components/SearchResultsTable';
import { SearchInput } from './components/SearchInput';
import { Help } from './components/Help';
import { Changelog } from './components/Changelog';
import { useDataLoader } from './hooks/useDataLoader';
import { useSearch } from './hooks/useSearch';
import { DataItem } from './types';

function App() {
  const [search, setSearch] = useState('');
  const [currentView, setCurrentView] = useState<'search' | 'help' | 'changelog'>('search');
  const { data, loading } = useDataLoader();
  const { results, hasSearched } = useSearch(search, data);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash === '#/help') {
        setCurrentView('help');
      } else if (window.location.hash === '#/changelog') {
        setCurrentView('changelog');
      } else {
        setCurrentView('search');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Check initial URL
    if (window.location.hash === '#/help') {
      setCurrentView('help');
    } else if (window.location.hash === '#/changelog') {
      setCurrentView('changelog');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load external styles
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-32">
        {currentView === 'search' ? (
          <>
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

            <SearchInput 
              search={search}
              onSearchChange={setSearch}
              loading={loading}
            />

            {loading && (
              <div className="mt-8 text-center text-gray-400">
                Loading data...
              </div>
            )}

            <SearchResultsTable 
              results={results}
              hasSearched={hasSearched}
              search={search}
            />
          </>
        ) : currentView === 'help' ? (
          <Help />
        ) : (
          <Changelog />
        )}

        <Footer />
      </main>
    </div>
  );
}

export default App;
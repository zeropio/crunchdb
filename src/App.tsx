// App.tsx
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchResultsTable } from './components/SearchResultsTable';
import { SearchInput } from './components/SearchInput';
import { Help } from './components/Help';
import { Changelog } from './components/Changelog';
import { useDataLoader } from './hooks/useDataLoader';
import { useSearch } from './hooks/useSearch';

function App() {
  const [search, setSearch] = useState('');
  const [currentView, setCurrentView] = useState<'search' | 'help' | 'changelog'>('search');
  const { data, loading } = useDataLoader();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { results, hasSearched } = useSearch(search, data);
  const totalItems = results.length;

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full"> {/* Removed flex-grow, added w-full */}
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
                  {data.length.toLocaleString('de-DE')} items loaded
                </p>
              )}
            </div>

            <SearchInput 
              search={search}
              onSearchChange={setSearch}
              loading={loading}
              currentPage={currentPage}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
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
              currentPage={currentPage}
            />
          </>
        ) : currentView === 'help' ? (
          <Help />
        ) : (
          <Changelog />
        )}
      </main>

      <div className="mt-auto"> {/* This div will push the footer to the bottom */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
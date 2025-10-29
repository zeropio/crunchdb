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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'search' | 'help' | 'changelog'>('search');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { stats, loading: statsLoading } = useDataLoader();
  const { results, loading: searchLoading, pagination, search } = useSearch();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/help') {
        setCurrentView('help');
      } else if (hash === '#/changelog') {
        setCurrentView('changelog');
      } else {
        setCurrentView('search');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      search(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
        {currentView === 'search' ? (
          <>
            <div className="mb-12 text-center">
              <h1 className="text-5xl font-bold text-white mb-4">
                CrunchDB
              </h1>
              <p className="text-xl text-gray-200 font-light mb-2">
                Apple's Magic Number Database
              </p>
              {stats && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 border border-gray-600 mt-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm text-gray-300">
                    {stats.totalItems.toLocaleString('de-DE')} items loaded
                  </span>
                </div>
              )}
            </div>

            <SearchInput 
              search={searchQuery}
              onSearchChange={setSearchQuery}
              loading={searchLoading}
              currentPage={currentPage}
              totalItems={pagination?.totalItems || 0}
              onPageChange={setCurrentPage}
            />

            {searchLoading && (
              <div className="mt-12 flex flex-col items-center">
                <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                <div className="text-gray-200 font-medium">Searching through the database...</div>
              </div>
            )}

            {!searchLoading && searchQuery && results.length === 0 && (
              <div className="mt-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-gray-200 text-lg">
                  No results found for "<span className="text-cyan-400 font-semibold">{searchQuery}</span>"
                </div>
                <div className="text-gray-400 text-sm mt-2">Try a different search term</div>
              </div>
            )}

            <SearchResultsTable 
              results={results}
              hasSearched={searchQuery.length > 0}
              search={searchQuery}
              currentPage={currentPage}
            />
          </>
        ) : currentView === 'help' ? (
          <Help />
        ) : (
          <Changelog />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
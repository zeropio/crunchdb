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
    if (searchQuery.trim()) {
      search(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        {currentView === 'search' ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-bold text-white mb-4">
                CrunchDB
              </h1>
              <p className="text-xl text-gray-400">
                Apple's Magic Number DataBase
              </p>
              {stats && (
                <p className="text-sm text-gray-500 mt-2">
                  {stats.totalItems.toLocaleString('de-DE')} items loaded
                </p>
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
              <div className="mt-8 text-center text-gray-400">
                Searching...
              </div>
            )}

            {!searchLoading && searchQuery && results.length === 0 && (
              <div className="mt-8 text-center text-gray-400">
                No results found for "{searchQuery}"
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
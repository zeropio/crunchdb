// components/SearchInput.tsx
import React from 'react';

interface SearchInputProps {
  search: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  search,
  onSearchChange,
  loading,
  currentPage,
  totalItems,
  onPageChange,
}) => {
  const itemsPerPage = 100;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePreviousPage = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && onPageChange(currentPage + 1);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
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

      {totalItems > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages} ({totalItems} total items)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
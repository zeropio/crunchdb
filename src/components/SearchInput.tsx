import React from 'react';

interface SearchInputProps {
  search: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  search,
  onSearchChange,
  loading
}) => {
  return (
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
  );
};
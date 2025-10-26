import React from 'react';
import { DataItem } from '../types';

interface SearchResultsTableProps {
  results: DataItem[];
  hasSearched: boolean;
  search: string;
}

export const SearchResultsTable: React.FC<SearchResultsTableProps> = ({
  results,
  hasSearched,
  search
}) => {
  if (results.length > 0) {
    return (
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
    );
  }

  if (hasSearched && search && results.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400">
        No results found for "{search}"
      </div>
    );
  }

  return null;
};
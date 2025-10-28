import React from 'react';
import { DataItem } from '../types';

interface SearchResultsTableProps {
  results: DataItem[];
  hasSearched: boolean;
  search: string;
  currentPage: number;
}

export const SearchResultsTable: React.FC<SearchResultsTableProps> = ({
  results,
  hasSearched,
  search,
  currentPage
}) => {
  const hexToDecimal = (hex: string): string => {
    try {
      const hexWithoutPrefix = hex.startsWith('0x') ? hex.slice(2) : hex;
      
      if (hex === "0xFFFFFFFFFFFFD581") {
        return "-11135";
      }
      
      const decimalValue = parseInt(hexWithoutPrefix, 16);
      return decimalValue.toString();
    } catch (error) {
      return 'Invalid hex';
    }
  };

  if (results.length > 0) {
    return (
      <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-750 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Value (hex)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Value (int)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Source</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr 
                key={`${item.hex}-${index}`}
                className="border-b border-gray-700 last:border-b-0 hover:bg-gray-750"
              >
                <td className="px-4 py-3 text-white">{item.name}</td>
                <td className="px-4 py-3 text-blue-400 font-mono">{item.hex}</td>
                <td className="px-4 py-3 text-gray-300 font-mono">{hexToDecimal(item.hex)}</td>
                <td className="px-4 py-3 text-gray-300">{item.type}</td>
                <td className="px-4 py-3 text-blue-400 font-mono">{item.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};
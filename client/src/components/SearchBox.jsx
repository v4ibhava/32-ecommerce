import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';

const SearchBox = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch(query);
    }, 500),
    [onSearch]
  );

  const handleChange = (e) => {
    const query = e.target.value;
    setValue(query);
    debouncedSearch(query);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-sm"
        placeholder="Search for chips, modules, or devkits..."
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;

import React, { useState } from 'react';
import './FilterSearch.css';

const FilterSearch = ({ onSubmit, placeholder = 'Search hotels...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ searchTerm });
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      <button type="button" className="search-button" onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
};

export default FilterSearch;

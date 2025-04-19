import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './FilterSearch.css';

const FilterSearch = ({
  onSubmit,
  placeholder = 'Search...',
  debounceTime = 300,
  rooms = [],
  className = '',
}) => {
  const [searchRoom, setSearchRoom] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchRoom(value);

    if (!onSubmit) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      const formValues = {
        searchRoom: value,
      };

      onSubmit(formValues);
    }, debounceTime);
  };

  return (
    <div className="filter-search-wrapper">
      <input
        type="text"
        style={{ padding: '8px' }}
        className="form-control search-input"
        placeholder={placeholder || 'Search...'}
        value={searchRoom}
        onChange={handleSearchChange}
        aria-label="Search input"
      />
    </div>
  );
};

FilterSearch.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  debounceTime: PropTypes.number,
  rooms: PropTypes.array,
  className: PropTypes.string,
};

export default FilterSearch;

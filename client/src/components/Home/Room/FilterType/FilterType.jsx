import React from 'react';
import PropTypes from 'prop-types';
import './FilterType.css';

const FilterType = ({ onChange, rooms = [] }) => {
  const uniqueTypes = [...new Set(rooms.map((room) => room.type))];

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    if (onChange) {
      onChange(selectedType);
    }
  };

  return (
    <div className="filter-type-wrapper">
      <select
        style={{ padding: '8px' }}
        className="form-control"
        onChange={handleTypeChange}
        aria-label="Filter by room type"
      >
        <option value="all">All Type</option>
        {uniqueTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

FilterType.propTypes = {
  onChange: PropTypes.func.isRequired,
  rooms: PropTypes.array,
};

export default FilterType;

import React, { useState } from 'react';

const FilterType = ({ onChange }) => {
  const [filterType, setFilterType] = useState('all');
  const handleFilterType = (e) => {
    setFilterType(e);
    if (!onChange) return;
    const formValues = {
      filterRoom: e,
    };

    if (e !== 'all') {
      onChange(formValues);
    } else {
      onChange(formValues);
      console.log(formValues);
    }
  };
  return (
    <div>
      <select
        className="form-select"
        value={filterType}
        onChange={(e) => handleFilterType(e.target.value)}
      >
        <option value="all">Tất cả</option>
        <option value="standard">Standard</option>
        <option value="delux">Delux</option>
      </select>
    </div>
  );
};

export default FilterType;

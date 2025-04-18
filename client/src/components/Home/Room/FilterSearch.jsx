import React, { useRef, useState } from 'react';

const FilterSearch = ({ onSubmit }) => {
  const [searchRoom, setSearchRoom] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchRoom(value);
    if (!onSubmit) return;
    // debounce search
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      const formValues = {
        searchRoom: e.target.value,
      };
   
      onSubmit(formValues);
    }, 300);
  }

  return (
    <form>
      <input
        type="text"
        className="form-control"
        placeholder="Tìm kiếm..."
        value={searchRoom}
        onChange={handleSearchChange}
      />
    </form>
  );
};

export default FilterSearch;

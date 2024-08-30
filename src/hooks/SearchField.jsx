import React, { useState, useEffect } from "react";

const SearchField = ({ onSearch, placeholder, customstyles }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    // Check if debouncedTerm is empty, if so, trigger onSearch with an empty string or a value that returns all data
    onSearch(debouncedTerm.trim());
  }, [debouncedTerm, onSearch]);

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="search-box"
      style={{
        display: "flex",
        outline: "thin",
        borderRadius: 20,
        boxShadow: 1,
        maxWidth: 280,
        padding: 10,
        ...customstyles,
      }}>
      <i
        className="bx bx-search-alt icon"
        style={{ fontSize: 30, paddingTop: 5 }}></i>
      <input
        type="search"
        className="date-input"
        placeholder={placeholder || "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
};

export default SearchField;

import "../components.css";
import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  function getSearch(event) {
    event.preventDefault();
    onSearch(searchTerm);
    console.log("Search term:", searchTerm);
  }

  return (
    <div className="container">
      <h2>Search a song...</h2>
      <form onSubmit={getSearch}>
        <input
          type="text"
          placeholder="Type..."
          className="song-input-search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input type="submit" value="Submit" className="song-input-submit" />
      </form>
    </div>
  );
}

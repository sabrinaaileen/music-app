import SpotifyWebApi from "spotify-web-api-js";
import "../components.css";
import React, { useState } from "react";

const spotifyApi = new SpotifyWebApi();

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  function getSearch(event) {
    event.preventDefault();
    console.log("Search term:", searchTerm);
    spotifyApi.searchTracks(searchTerm, { limit: 10 }).then((response) => {
      const tracks = response.tracks.items;
      onSearch(tracks); //Pass the fetched songs to the parent component
    });
  }

  return (
    <div className="container">
      <h2>Search a song...</h2>
      <form onSubmit={getSearch}>
        <input
          type="text"
          placeholder="Type a song..."
          className="song-input-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input type="submit" value="Submit" className="song-input-submit" />
      </form>
    </div>
  );
}

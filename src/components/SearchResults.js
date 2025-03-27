import "../components.css";
import React from "react";

export default function SearchResults({ searchedSongs, onAddTrack }) {
  return (
    <div className="container">
      <h2>Results:</h2>
      <ul>
        {searchedSongs.map((track) => (
          <li key={track.id} className="search-result-listitem">
            {track.name} <span className="bold-text"> by </span>
            <span className="italic-artist">
              {track.artists && track.artists.length > 0
                ? track.artists.map((artist) => artist.name).join(", ")
                : "Unknown Artist"}
            </span>
            <button
              className="add-track-button"
              onClick={() => onAddTrack(track)}
            >
              +
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

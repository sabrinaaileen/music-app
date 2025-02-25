import "../components.css";
import React from "react";

export default function SearchResults({ searchedSongs, onAddTrack }) {
  return (
    <div className="container">
      <h2>Results:</h2>
      <ul>
        {searchedSongs.map((track) => (
          <li key={track.id}>
            {track.name} by{" "}
            {track.artists && track.artists.length > 0
              ? track.artists.map((artist) => artist.name).join(", ")
              : "Unknown Artist"}
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

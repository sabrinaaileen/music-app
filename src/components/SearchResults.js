import "../components.css";
import React from "react";

export default function SearchResults({ searchedSongs, onAddTrack }) {
  console.log(searchedSongs);
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
              title="Add this track to a selected plalist"
              onClick={() => onAddTrack(track)}
            >
              +
            </button>
            {track.preview_url ? (
              <audio controls>
                <source
                  src={track.preview_url}
                  type="audio/mpeg"
                  title="click for preview"
                />{" "}
                🎶{" "}
              </audio>
            ) : (
              <span title="No preview available">
                {" "}
                🚫{" "}
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Listen full song on Spotify"
                  className="listen-on-spotify-link"
                >
                  ▶️ 🔊
                </a>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

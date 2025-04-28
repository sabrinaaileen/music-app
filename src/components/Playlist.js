import "../components.css";
import React, { useState } from "react";
import RenamePlaylist from "./RenamePlaylist";

export default function Playlist({ playlist, trackList }) {
  const [playlistName, setPlaylistName] = useState(
    playlist ? playlist.name : ""
  );

  const handleRename = (newName) => {
    setPlaylistName(newName);
  };

  if (!playlist)
    return (
      <div className="playlist-info-text">
        Select a Playlist to view tracks.
      </div>
    );

  return (
    <div className="container">
      <div className="grid">
        <div className="grid-item">
          <h2>{playlist.name}</h2>
        </div>
        <div className="grid-item">
          <RenamePlaylist playlistName={playlistName} onRename={handleRename} />
        </div>
      </div>
      <ul>
        {trackList.length > 0 ? (
          trackList.map((item) => (
            <li key={item.track.id}>
              {item.track.name} <span className="bold-text">by </span>
              {item.track.artists && item.track.artists.length > 0
                ? item.track.artists.map((artist) => artist.name).join(", ")
                : "Unknown Artist"}
            </li>
          ))
        ) : (
          <li>No tracks in this playlist.</li>
        )}
      </ul>
      {playlist.external_urls && playlist.external_urls.spotify ? (
        <div>
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="playlist-external-link"
          >
            Visit Spotify to see the whole list
          </a>
        </div>
      ) : (
        <p>Playlist link not available.</p>
      )}
    </div>
  );
}

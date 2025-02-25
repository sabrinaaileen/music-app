import React, { useState } from "react";
import "../components.css";

export default function CreatePlaylist({ onCreatePlaylist }) {
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreatePlaylist(playlistName);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name your new playlist..."
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="song-input-search"
        />
        <button type="submit" className="song-input-submit">
          Create Playlist
        </button>
      </form>
    </div>
  );
}

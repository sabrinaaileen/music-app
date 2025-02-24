import React, { useState } from "react";

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
        />
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
}

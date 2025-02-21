import React, { useState } from "react";

export default function CreatePlaylist({ onCreatePlaylist }) {
  const [playlistName, setPlaylistName] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreatePlaylist(playlistName, selectedTracks);
  };

  const handleTrackSolution = (track) => {};

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name your new plalist..."
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
}

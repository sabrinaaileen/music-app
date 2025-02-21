import React from "react";

export default function PlaylistList({ playlists, onSelect }) {
  return (
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map((playlist, index) => (
          <li key={index} onClick={() => onSelect(playlist)}>
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

import "../components.css";
import React from "react";

export default function Playlist({ playlist }) {
  if (!playlist) return <div>Select a Playlist to view tracks.</div>;

  return (
    <div className="container">
      <h2>{playlist.name}</h2>
      <ul>
        {playlist.tracks.map((track, index) => (
          <li key={index}>
            {track.name} by{" "}
            {track.artists.map((artist) => artist.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

import "../components.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import RenamePlaylist from "./RenamePlaylist";

const spotifyApi = new SpotifyWebApi();

export default function Playlist({ playlist, trackList, onRemoveTrack }) {
  const [playlistName, setPlaylistName] = useState(
    playlist ? playlist.name : ""
  );

  //Set up Spotify access token on mount
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      spotifyApi.setAccessToken(token);
    }
  }, []); //Empty dependency array means this runs once when the component mounts

  // Update playlist name when the playlist prop changes
  useEffect(() => {
    if (playlist) {
      setPlaylistName(playlist.name);
    }
  }, [playlist]); // This will run whenever the playlist changes

  const handleRename = (newName) => {
    setPlaylistName(newName);
    //Make the API call to rename playlist
    const playlistId = playlist.id; //Ensure you have playlist ID
    spotifyApi
      .changePlaylistDetails(playlistId, { name: newName })
      .then((response) => {
        console.log("Updated playlist name on Spotify: ", response);
      })
      .catch((error) => {
        console.error("Error updating playlist name: ", error);
      });
  };

  if (!playlist)
    return (
      <div className="playlist-info-text">
        Select a Playlist to view tracks.
      </div>
    );

  return (
    <div className="container">
      <span>
        <h2>{playlistName}</h2>

        <RenamePlaylist playlistName={playlistName} onRename={handleRename} />
      </span>
      <ul>
        {trackList.length > 0 ? (
          trackList.map((item) => (
            <li key={item.track.id}>
              {item.track.name} <span className="bold-text">by </span>
              {item.track.artists && item.track.artists.length > 0
                ? item.track.artists.map((artist) => artist.name).join(", ")
                : "Unknown Artist"}
              <button
                className="add-track-button"
                title="Remove this track from the playlist"
                onClick={() => onRemoveTrack(item.track)}
              >
                -
              </button>
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

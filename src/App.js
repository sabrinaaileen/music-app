import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

import NowPlaying from "./components/NowPlaying";
import RecentlyPlayed from "./components/RecentlyPlayed";
import TopHits from "./components/TopHits";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import CreatePlaylist from "./components/CreatePlaylist";
import PlaylistList from "./components/PlaylistList";

const spotifyApi = new SpotifyWebApi();

const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchedSongs, setSearchedSongs] = useState([]);

  useEffect(() => {
    console.log("This is what you get.", getTokenFromUrl());
    const spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = "";
    console.log("Spotify Token:", spotifyToken);

    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      spotifyApi.setAccessToken(spotifyToken);
      spotifyApi.getMe().then((user) => {
        console.log(user);
      });
      setLoggedIn(true);
    }
  }, []);

  //Function to handle the create playlist
  const handleCreatePlaylist = (name) => {
    const newPlaylist = { name, tracks: [] };
    setPlaylists([...playlists, newPlaylist]);
  };

  //Function to selct playlist
  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  //Function to handle adding a track to a playlist
  const handleAddTrackToPlaylist = (track) => {
    if (selectedPlaylist) {
      const updatedPlaylists = playlists.map((playlist) => {
        if (playlist === selectedPlaylist) {
          return {
            ...playlist,
            tracks: [...playlist.tracks, track],
          };
        }
        return playlist;
      });
      setPlaylists(updatedPlaylists);
    }
  };

  return (
    <div className="App">
      <div>
        {!loggedIn && (
          <a href="http://localhost:8888" className="login-button">
            Login to Spotify
          </a>
        )}
        {loggedIn && <NowPlaying />}
      </div>
      <main>
        {loggedIn && <SearchBar onSearch={setSearchedSongs} />}
        {loggedIn && (
          <div className="grid">
            <div className="grid-item">
              <SearchResults
                searchedSongs={searchedSongs}
                onAddTrack={handleAddTrackToPlaylist}
              />
            </div>
            <div className="grid-item">
              <CreatePlaylist onCreatePlaylist={handleCreatePlaylist} />
              <PlaylistList
                playlists={playlists}
                onSelect={handleSelectPlaylist}
              />
              <Playlist playlist={selectedPlaylist} />
            </div>
          </div>
        )}
      </main>

      {loggedIn && (
        <div className="grid">
          <div className="grid-item">
            <RecentlyPlayed />
          </div>
          <div className="grid-item">
            <TopHits />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

import NowPlaying from "./components/NowPlaying";
import RecentlyPlayed from "./components/RecentlyPlayed";
import TopHits from "./components/TopHits";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

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
  });

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
        {loggedIn && <SearchBar />}
        {loggedIn && (
          <div className="grid">
            <div className="grid-item">
              <SearchResults />
            </div>
            <div className="grid-item">
              <Playlist />
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

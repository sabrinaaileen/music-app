import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

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
  const [nowPlaying, setNowPlaying] = useState({});
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

  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      console.log(response);
      setNowPlaying({
        name: response.item.name,
        albumArt: response.item.album.images[0].url,
      });
    });
  };

  return (
    <div className="App">
      <div>
        {!loggedIn && (
          <a href="http://localhost:8888" className="login-button">
            Login to Spotify
          </a>
        )}
        <div className="now-playing-container">
          {loggedIn && <h1>Welcome to your Music!</h1>}
          {loggedIn && (
            <>
              <h2>Now Playing: {nowPlaying.name}</h2>
              <div>
                <img src={nowPlaying.albumArt} style={{ height: 150 }} />
              </div>
            </>
          )}
          {loggedIn && (
            <button onClick={() => getNowPlaying()}>Check Now Playing</button>
          )}
        </div>
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

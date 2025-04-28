import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NowPlaying from "./components/NowPlaying";
import RecentlyPlayed from "./components/RecentlyPlayed";
import TopHits from "./components/TopHits";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import CreatePlaylist from "./components/CreatePlaylist";
import PlaylistList from "./components/PlaylistList";
import Footer from "./components/Footer";

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
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchedSongs, setSearchedSongs] = useState([]);
  const [trackList, setTrackList] = useState([]);

  console.log("Spotify Token:", spotifyToken);

  useEffect(() => {
    console.log("This is what you get.", getTokenFromUrl());
    const tokenFromUrl = getTokenFromUrl().access_token;
    const tokenFromStorage = localStorage.getItem("spotify_token");
    window.location.hash = "";
    let token = tokenFromUrl || tokenFromStorage;

    if (token) {
      setSpotifyToken(token);
      spotifyApi.setAccessToken(token);
      if (tokenFromUrl) {
        localStorage.setItem("spotify_token", tokenFromUrl);
      }
      //Fetch user playlists
      spotifyApi
        .getUserPlaylists({ limit: 10 })
        .then((response) => {
          console.log("User playlist: ", response);
          setPlaylists(response.items);
        })
        .catch((error) => {
          console.error("Error fetching playlists: ", error);
        });
      spotifyApi.getMe().then((user) => {
        console.log(user);
      });
      setLoggedIn(true);
    }
  }, []);

  //Check Token
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      setLoggedIn(true);
      //When logged in, get user data
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token invalid or expired");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Spotify user data: ", data);
          setUserData(data);
          setLoggedIn(true);
        })
        .catch((error) => {
          console.error("Problem with Spotify Login: ", error);
          localStorage.removeItem("spotify_token");
          setLoggedIn(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  //Fetch playlist tracks
  useEffect(() => {
    if (selectedPlaylist) {
      spotifyApi
        .getPlaylistTracks(selectedPlaylist.id, { limit: 10 })
        .then((response) => {
          setTrackList(response.items);
        })
        .catch((error) => {
          console.log("Error fetching playlist tracks: ", error);
        });
    }
  }, [selectedPlaylist]);

  //Function to handle the create playlist
  const handleCreatePlaylist = (name) => {
    spotifyApi.getMe().then((user) => {
      spotifyApi
        .createPlaylist(user.id, { name: name, public: false })
        .then((response) => {
          const newPlaylist = {
            id: response.id,
            name: response.name,
            tracks: [],
            external_urls: response.external_urls,
          };
          setPlaylists([...playlists, newPlaylist]);
          console.log("New Playlist Created: ", newPlaylist);
        })
        .catch((error) => {
          console.error("Error creating playlist: ", error);
        });
    });
  };

  //Function to selct playlist
  const handleSelectPlaylist = (playlist) => {
    const selected = playlists.find((pl) => pl.id === playlist.id);
    const playlistWithTracks = {
      ...selected,
      tracks: Array.isArray(selected.tracks) ? selected.tracks : [],
    };
    setSelectedPlaylist(playlistWithTracks);
    console.log("Selected Playlist: ", playlistWithTracks);
  };

  //Function to handle adding a track to a playlist
  const handleAddTrackToPlaylist = (track) => {
    console.log("Adding track: ", track);
    if (selectedPlaylist) {
      const trackUri = track.uri;
      spotifyApi
        .addTracksToPlaylist(selectedPlaylist.id, [trackUri])
        .then((response) => {
          console.log("Track added to playlist: ", response);
          const updatedPlaylists = playlists.map((playlist) => {
            if (playlist.id === selectedPlaylist.id) {
              const updatedTracks = Array.isArray(selectedPlaylist.tracks)
                ? [...selectedPlaylist.tracks, track] // Append the new track
                : [track]; // Initialize as an array with the new track if tracks is not an array

              return {
                ...playlist,
                tracks: updatedTracks,
              };
            }
            return playlist;
          });

          setPlaylists(updatedPlaylists);
          setSelectedPlaylist((prev) => ({
            ...prev,
            tracks: Array.isArray(prev.tracks)
              ? [...prev.tracks, track]
              : [track],
          }));
        })
        .catch((error) => {
          console.log("Error adding track to playlist: ", error);
        });
    }
  };

  function Callback() {
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("access_token");

      if (token) {
        localStorage.setItem("spotify_token", token);
        console.log("Spotify Token saved: ", token);
        //After successful login back to homepage
        window.location.href = "/";
      }
    }, []);
    return <div>Authentification is running...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    setLoggedIn(false);
    setUserData(null);
  };

  if (loading) {
    return <div>Loading App...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="App">
                <div>
                  {!loggedIn ? (
                    <div>
                      <a
                        href="https://spotify-authentication-server.onrender.com/login"
                        className="login-button"
                      >
                        Login to Spotify
                      </a>
                      <p className="login-paragraph">
                        Please be patient. The backend server is sleeping and
                        needs a few moments to awake!
                      </p>
                    </div>
                  ) : userData ? (
                    <div>
                      <main>
                        <NowPlaying />
                        <SearchBar onSearch={setSearchedSongs} />
                        <div className="grid">
                          <div className="grid-item">
                            <SearchResults
                              searchedSongs={searchedSongs}
                              onAddTrack={handleAddTrackToPlaylist}
                            />
                          </div>
                          <div className="grid-item container">
                            <CreatePlaylist
                              onCreatePlaylist={handleCreatePlaylist}
                            />
                            <PlaylistList
                              playlists={playlists}
                              onSelect={handleSelectPlaylist}
                            />
                            <ErrorBoundary>
                              <Playlist
                                playlist={selectedPlaylist}
                                trackList={trackList}
                              />
                            </ErrorBoundary>
                          </div>
                        </div>
                        <div className="grid">
                          <div className="grid-item">
                            <RecentlyPlayed />
                          </div>
                          <div className="grid-item">
                            <TopHits />
                          </div>
                        </div>
                        <button onClick={handleLogout} className="login-button">
                          Logout
                        </button>
                      </main>
                      <footer>
                        <Footer />
                      </footer>
                    </div>
                  ) : (
                    <p>Loading user data...</p>
                  )}
                </div>
              </div>
            </>
          }
        />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;

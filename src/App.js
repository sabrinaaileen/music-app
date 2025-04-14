import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";

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
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchedSongs, setSearchedSongs] = useState([]);
  const [trackList, setTrackList] = useState([]);

  console.log("Spotify Token:", spotifyToken);

  useEffect(() => {
    console.log("This is what you get.", getTokenFromUrl());
    const spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = "";

    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      spotifyApi.setAccessToken(spotifyToken);
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
            <div className="grid-item container">
              <CreatePlaylist onCreatePlaylist={handleCreatePlaylist} />
              <PlaylistList
                playlists={playlists}
                onSelect={handleSelectPlaylist}
              />
              <ErrorBoundary>
                <Playlist playlist={selectedPlaylist} trackList={trackList} />
              </ErrorBoundary>
            </div>
          </div>
        )}
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
      </main>
      <footer>{loggedIn && <Footer />}</footer>
    </div>
  );
}

export default App;

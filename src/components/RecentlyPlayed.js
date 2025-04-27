import "../components.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export default function RecentlyPlayed() {
  const [recentTracks, setRecentTracks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      spotifyApi.setAccessToken(token);
    }
  });

  useEffect(() => {
    getRecentTracks();
  }, []);

  const getRecentTracks = () => {
    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 5 })
      .then((response) => {
        if (response && response.items) {
          console.log(response);
          setRecentTracks(response.items);
        }
      })
      .catch((error) => {
        console.log("Error showing recent played tracks: ", error);
      });
  };

  return (
    <div className="container">
      <h2>Recently played:</h2>
      <ul>
        {recentTracks.map((item) => (
          <li key={item.track.id} className="recently-played-listitem">
            {item.track.name} <br /> <br />{" "}
            <span className="bold-text">by </span>
            <span className="italic-artist">
              {item.track.artists.map((artist) => artist.name).join(", ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

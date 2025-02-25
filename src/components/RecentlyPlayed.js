import "../components.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export default function RecentlyPlayed() {
  const [recentTracks, setRecentTracks] = useState([]);

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
          <li key={item.track.id}>
            {item.track.name} by{" "}
            {item.track.artists.map((artist) => artist.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

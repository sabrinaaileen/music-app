import "../components.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export default function TopHits() {
  const [topHits, setTopHits] = useState([]);

  useEffect(() => {
    getTopHits();
  }, []);

  const getTopHits = () => {
    spotifyApi
      .getMyTopTracks({ limit: 5 })
      .then((response) => {
        if (response && response.items) {
          console.log(response);
          setTopHits(response.items);
        }
      })
      .catch((error) => {
        console.log("Error showing top tracks: ", error);
      });
  };

  return (
    <div className="container">
      <h2>Look at your top hits and artists:</h2>
      <ul>
        {topHits.map((track) => (
          <li key={track.id} className="top-hits-listitem">
            {track.name} <span className="bold-text">by </span>
            <span className="italic-artist">
              {track.artists.map((artist) => artist.name).join(", ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

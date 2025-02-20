import "../components.css";
import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export default function SearchResults({ searchTerm }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      spotifyApi.searchTracks(searchTerm).then((response) => {
        setResults(response.tracks.items);
      });
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="container">
      <h2>Results:</h2>
      <ul>
        {results.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artists[0].name}
          </li>
        ))}
      </ul>
    </div>
  );
}

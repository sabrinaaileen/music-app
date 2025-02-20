import "../App.css";
import React, { useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export default function NowPlaying() {
  const [nowPlaying, setNowPlaying] = useState({});

  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      if (response) {
        console.log(response);
        setNowPlaying({
          name: response.item.name,
          albumArt: response.item.album.images[0].url,
        });
      } else {
        setNowPlaying({
          name: "No music is playing...",
        });
      }
    });
  };

  return (
    <div className="now-playing-container">
      <h1>Welcome to your Music!</h1>

      <>
        <h2>Now Playing: {nowPlaying.name}</h2>
        <div>
          <img src={nowPlaying.albumArt} style={{ height: 150 }} />
        </div>
      </>

      <button onClick={() => getNowPlaying()}>Check Now Playing</button>
    </div>
  );
}

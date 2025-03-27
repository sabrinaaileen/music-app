export default function Footer() {
  return (
    <div className="footer-grid">
      <div className="footer-grid-item">
        <h4>About this website</h4>
        <p>
          It is a project to practise api integration. I built an app using
          React.js and the Spotify Api. You can log in your account to see your
          music and create new playlist (and add new songs to the playlists). I
          hope you enjoy playing around!
        </p>
      </div>
      <div className="footer-grid-item">
        <h4>About me</h4>
        <p>
          I'm an actress who loves to code! Visit my{" "}
          <a
            href="https://www.sabrina-aileen-hodapp.de"
            target="_blank"
            rel="noreferrer"
          >
            website
          </a>{" "}
          or contact me right away via{" "}
          <a
            href="mailto:hodapp.sabrina@live.de"
            target="_blank"
            rel="noreferrer"
          >
            Mail
          </a>
          . I am looking forward to code more!
        </p>
      </div>
      <div className="footer-grid-item">
        <h4>About music</h4>
        <p>
          I belive, that music is the key to everything: emotions, connections
          and innovation. All the different genres can take us to another goal.
          So let's celebrate and enjoy music!
        </p>
      </div>
    </div>
  );
}

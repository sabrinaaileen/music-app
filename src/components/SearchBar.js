import "../components.css";

export default function SearchBar() {
  return (
    <div className="container">
      <h2>Search a song...</h2>
      <form>
        <input
          type="text"
          placeholder="Type..."
          className="song-input-search"
        />
        <input type="submit" value="Submit" className="song-input-submit" />
      </form>
    </div>
  );
}

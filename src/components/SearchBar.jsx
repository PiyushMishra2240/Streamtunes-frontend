import { useState } from "react";
import { searchSongs } from "../api/songsApi";

const SearchBar = ({ setSongs }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const response = await searchSongs(query);
    setSongs(response.data.content);
  };

  return (
    <div>
      <input
        placeholder="Search songs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;

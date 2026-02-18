import { useEffect, useState } from "react";
import { getSongs } from "../api/songsApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { playSong } = useAudioPlayer();

  useEffect(() => {
    let isMounted = true;

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await getSongs(page, 10);
        const data = await response.data;

        if (isMounted) {
          setSongs(data.songs);
        }
      } catch (err) {
        console.error("Failed to fetch songs", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSongs();

    return () => {
      isMounted = false;
    };
  }, [page]);

  return (
    <div className="bg-[#181818] p-8 rounded-2xl border border-gray-800 shadow-xl">
      <h2 className="text-xl font-semibold mb-6">Songs</h2>
      <div className="space-y-4"></div>
      {loading && <p>Loading...</p>}
      <div className="flex justify-between items-center bg-[#242424] px-5 py-4 rounded-lg hover:bg-[#2e2e2e] transition cursor-pointer">
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => playSong(song)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <p className="font-medium">{song.title}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">

        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className={`px-5 py-2 rounded-full font-medium transition
            ${
              page === 0
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400 text-black"
            }`}
        >
          ← Previous
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-5 py-2 rounded-full bg-green-500 hover:bg-green-400 text-black font-medium transition"
        >
          Next →
        </button>
      </div>

    </div>
  );
};

export default SongList;

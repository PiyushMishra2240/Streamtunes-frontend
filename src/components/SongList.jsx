import { useEffect, useState } from "react";
import { getSongs } from "../api/songsApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { playSong, currentSong } = useAudioPlayer();

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

  const isPlaying = (song) => currentSong?.id === song.id;

  return (
    <div className="bg-[#181818] p-8 rounded-2xl border border-gray-800 shadow-xl">
      <h2 className="text-xl font-semibold mb-6">Songs</h2>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {songs.map((song, index) => {
          const active = isPlaying(song);
          return (
            <div
              key={song.id}
              onClick={() => playSong(song)}
              className={`
                flex items-center gap-4 px-5 py-4 rounded-lg cursor-pointer
                transition-all duration-200 group
                ${active
                  ? "bg-green-500/15 border-l-4 border-green-400 shadow-lg shadow-green-500/5"
                  : "bg-[#242424] border-l-4 border-transparent hover:bg-[#2e2e2e] hover:border-green-500/30"
                }
              `}
            >
              <span className={`
                w-8 text-center text-sm font-mono shrink-0
                ${active ? "text-green-400 font-bold" : "text-gray-500 group-hover:text-gray-300"}
              `}>
                {active ? "♫" : index + 1 + page * 10}
              </span>

              <div className="flex-1 min-w-0">
                <p className={`
                  font-medium truncate
                  ${active ? "text-green-300" : "text-white"}
                `}>
                  {song.title}
                </p>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>

              {active && (
                <span className="text-xs text-green-400 font-medium px-3 py-1 bg-green-500/10 rounded-full animate-pulse shrink-0">
                  Now Playing
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!loading && songs.length === 0 && (
        <p className="text-gray-500 text-center py-8">No songs found</p>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className={`px-5 py-2 rounded-full font-medium transition
            ${page === 0
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-400 text-black"
            }`}
        >
          ← Previous
        </button>

        <span className="text-sm text-gray-500">Page {page + 1}</span>

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

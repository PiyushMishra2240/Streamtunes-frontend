import { useEffect, useState } from "react";
import { getSongs, toggleLikeStatus } from "../api/songsApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";

const SongList = () => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const { playSong, currentSong, songs, setSongs } = useAudioPlayer();

  useEffect(() => {
    let isMounted = true;

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await getSongs(page, 10);
        const data = await response.data;

        if (isMounted) {
          setSongs(data.songs);
          setTotalPages(data.totalPages);
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
    <div className="bg-[#181818] p-4 sm:p-8 rounded-2xl border border-gray-800 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🌍</span>
        <h2 className="text-xl font-semibold">Global Songs</h2>
      </div>

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
                flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 rounded-lg cursor-pointer
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
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  {song.uploadedBy && (
                    <>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-xs text-gray-500 italic truncate max-w-[120px]">
                        by @{song.uploadedBy}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const wasLiked = song.isLikedByCurrentUser;
                  
                  // Optimistic update
                  setSongs((prevSongs) =>
                    prevSongs.map((s) =>
                      s.id === song.id ? { 
                        ...s, 
                        isLikedByCurrentUser: !wasLiked,
                        likeCount: wasLiked ? s.likeCount - 1 : s.likeCount + 1
                      } : s
                    )
                  );
                  
                  try {
                    await toggleLikeStatus(song.id);
                  } catch (err) {
                    console.error("Failed to toggle like status", err);
                    // Revert on failure
                    setSongs((prevSongs) =>
                      prevSongs.map((s) =>
                        s.id === song.id ? { 
                          ...s, 
                          isLikedByCurrentUser: wasLiked,
                          likeCount: wasLiked ? s.likeCount + 1 : s.likeCount - 1
                        } : s
                      )
                    );
                  }
                }}
                title={song.isLikedByCurrentUser ? "Unlike" : "Like"}
                className="p-2 mr-2 rounded-full transition-colors shrink-0 hover:bg-white/10 flex items-center gap-1"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill={song.isLikedByCurrentUser ? "currentColor" : "none"} 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className={`w-5 h-5 ${song.isLikedByCurrentUser ? "text-red-500" : "text-gray-500"}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="text-xs text-gray-500 min-w-[1rem]">{song.likeCount || 0}</span>
              </button>

              {active && (
                <span className="text-xs text-green-400 font-medium px-2 sm:px-3 py-1 bg-green-500/10 rounded-full animate-pulse shrink-0 hidden xs:inline">
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

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base transition
              ${page === 0
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400 text-black"
              }`}
          >
            ← Previous
          </button>

          <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 sm:px-5 py-2 rounded-full font-medium text-sm sm:text-base transition
              ${page >= totalPages - 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400 text-black"
              }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default SongList;

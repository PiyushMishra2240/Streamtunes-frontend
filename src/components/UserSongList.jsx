import { useEffect, useState } from "react";
import { getUserSongs, toggleGlobalStatus, toggleLikeStatus } from "../api/songsApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import UploadForm from "./UploadForm";

const UserSongList = () => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const { playSong, currentSong, songs, setSongs } = useAudioPlayer();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await getUserSongs(page, 10);
        const data = response.data;

        if (isMounted) {
          setSongs(data.songs);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch user songs", err);
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
  }, [page, refreshKey]);

  const handleUploadComplete = () => {
    setRefreshKey((k) => k + 1);
  };

  const isPlaying = (song) => currentSong?.id === song.id;

  return (
    <div className="space-y-8">
      <UploadForm refresh={handleUploadComplete} />

      <div className="bg-[#181818] p-4 sm:p-8 rounded-2xl border border-gray-800 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🎵</span>
          <h2 className="text-xl font-semibold">Your Songs</h2>
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
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>

                {song.album && (
                  <span className="text-xs text-gray-500 hidden sm:block truncate max-w-[120px]">
                    {song.album}
                  </span>
                )}

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
                  className="p-2 rounded-full transition-colors shrink-0 hover:bg-white/10 flex items-center gap-1"
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

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await toggleGlobalStatus(song.id);
                      setSongs((prevSongs) =>
                        prevSongs.map((s) =>
                          s.id === song.id ? { ...s, isGlobal: !s.isGlobal } : s
                        )
                      );
                    } catch (err) {
                      console.error("Failed to toggle global status", err);
                    }
                  }}
                  title={song.isGlobal ? "Make Private" : "Make Global"}
                  className={`p-2 rounded-full transition-colors shrink-0 ${
                    song.isGlobal 
                      ? "text-green-400 hover:bg-green-500/20" 
                      : "text-gray-500 hover:bg-white/10"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
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
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🎶</p>
            <p className="text-gray-400 text-lg mb-2">No songs yet</p>
            <p className="text-gray-500 text-sm">Upload your first song above to get started!</p>
          </div>
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
    </div>
  );
};

export default UserSongList;

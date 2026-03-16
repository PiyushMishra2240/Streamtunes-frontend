import { useEffect, useState } from "react";
import { getAnalytics, toggleLikeStatus, toggleGlobalStatus } from "../api/songsApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";

const Analytics = () => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("likes");
  const { playSong, currentSong, songs, setSongs } = useAudioPlayer();

  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getAnalytics(sortBy, page, 10);
        const data = await response.data;

        if (isMounted) {
          setSongs(data.songs);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [page, sortBy]);

  const isPlaying = (song) => currentSong?.id === song.id;

  return (
    <div className="bg-[#181818] p-4 sm:p-8 rounded-2xl border border-gray-800 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <h2 className="text-xl font-semibold">Global Songs Insights</h2>
        </div>
        
        <div className="flex items-center gap-2 text-sm bg-[#242424] p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => { setSortBy("likes"); setPage(0); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              sortBy === "likes" 
                ? "bg-green-500/20 text-green-400 font-medium shadow-sm" 
                : "text-gray-400 hover:text-white hover:bg-[#2e2e2e]"
            }`}
          >
            Highest Likes
          </button>
          <button
            onClick={() => { setSortBy("date"); setPage(0); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              sortBy === "date" 
                ? "bg-green-500/20 text-green-400 font-medium shadow-sm" 
                : "text-gray-400 hover:text-white hover:bg-[#2e2e2e]"
            }`}
          >
            Newest First
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {songs.map((song, index) => {
          const active = isPlaying(song);
          const uploadDate = new Date(song.createdAt).toLocaleDateString();
          
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
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-sm">
                <div className="flex flex-col items-end text-gray-400">
                  <span className="text-xs uppercase tracking-wider text-gray-500">Likes</span>
                  <span className="font-medium text-gray-200">{song.likeCount || 0}</span>
                </div>
                <div className="flex flex-col items-end text-gray-400 hidden sm:flex">
                  <span className="text-xs uppercase tracking-wider text-gray-500">Uploaded</span>
                  <span className="font-medium">{uploadDate}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {!loading && songs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-800 rounded-xl bg-[#1e1e1e] mt-4">
          <span className="text-4xl mb-3 opacity-50">📉</span>
          <p className="text-gray-400 font-medium">You haven&apos;t uploaded any global songs yet.</p>
          <p className="text-sm text-gray-500 mt-1">Share some of your songs globally to see insights here.</p>
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
  );
};

export default Analytics;

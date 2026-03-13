import { useAudioPlayer } from "../context/AudioPlayerContext";

const Player = () => {
  const { currentSong, playNext, playPrevious } = useAudioPlayer();

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        h-auto min-h-[4.5rem] bg-[#181818]/95 backdrop-blur-md border-t border-gray-800
        px-4 sm:px-10 py-3 flex flex-col sm:flex-row items-center justify-between shadow-2xl gap-2 sm:gap-4
        transition-transform duration-500 ease-out
        ${currentSong ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="min-w-0 w-full sm:w-48 shrink-0 text-center sm:text-left">
        <p className="font-semibold truncate text-sm sm:text-base">{currentSong?.title}</p>
        <p className="text-xs sm:text-sm text-gray-400 truncate">{currentSong?.artist}</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center w-full">
        <button
          onClick={playPrevious}
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition shrink-0"
          aria-label="Previous song"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V7.19c0-1.44-1.555-2.343-2.805-1.628L12 9.53v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
          </svg>
        </button>

        <audio
          controls
          autoPlay
          key={currentSong?.id}
          className="w-full max-w-[20rem] sm:max-w-[24rem] accent-green-500"
          src={currentSong ? `http://localhost:8080/api/songs/${currentSong.id}/stream` : undefined}
          onEnded={playNext}
        />

        <button
          onClick={playNext}
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition shrink-0"
          aria-label="Next song"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v9.622c0 1.44 1.555 2.343 2.805 1.628L12 16.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 8.346 12 9.25 12 10.69v2.34L5.055 7.06Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Player;

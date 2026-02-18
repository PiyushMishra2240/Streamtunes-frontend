import { useAudioPlayer } from "../context/AudioPlayerContext";

const Player = () => {
  const { currentSong } = useAudioPlayer();

  if (!currentSong) return null;

  return (
    <div className="h-24 bg-[#181818] border-t border-gray-800 px-10 flex items-center justify-between shadow-inner">
  <div>
    <p className="font-semibold">{currentSong?.title}</p>
    <p className="text-sm text-gray-400">{currentSong?.artist}</p>
  </div>

  <audio
    controls
    autoPlay
    className="w-1/2 accent-green-500"
    src={`http://localhost:8080/api/songs/${currentSong?.id}/stream`}
  />
</div>

  );
};

export default Player;

import { useState } from "react";
import { AudioPlayerContext } from "./AudioPlayerContext";

export const AudioPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  const playSong = (song) => {
    setCurrentSong(song);
  };

  return (
    <AudioPlayerContext.Provider value={{ currentSong, playSong }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

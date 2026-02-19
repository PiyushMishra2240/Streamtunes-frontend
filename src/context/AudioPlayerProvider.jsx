import { useState, useCallback } from "react";
import { AudioPlayerContext } from "./AudioPlayerContext";

export const AudioPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);

  const playSong = useCallback((song) => {
    setCurrentSong(song);
  }, []);

  const playNext = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  }, [songs, currentSong]);

  const playPrevious = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
  }, [songs, currentSong]);

  return (
    <AudioPlayerContext.Provider
      value={{ currentSong, songs, setSongs, playSong, playNext, playPrevious }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};


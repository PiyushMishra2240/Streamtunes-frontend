import { createContext, useContext } from "react";

export const AudioPlayerContext = createContext(null);

export const useAudioPlayer = () => {
  return useContext(AudioPlayerContext);
};

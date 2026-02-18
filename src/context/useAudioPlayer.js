import { useContext } from "react";
import { AudioPlayerContext } from "./AudioPlayerContext";

export const useAudioPlayer = () => {
  return useContext(AudioPlayerContext);
};

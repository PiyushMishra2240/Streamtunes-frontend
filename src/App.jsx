import UploadForm from "./components/UploadForm";
import SongList from "./components/SongList";
import Player from "./components/Player";
import { AudioPlayerProvider } from "./context/AudioPlayerProvider";

function App() {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen flex flex-col">

        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-700 shadow-lg">
          <h1 className="text-3xl font-bold tracking-wide">
            🎵 StreamTunes
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-10 pb-28 space-y-10 max-w-5xl mx-auto w-full">
          <UploadForm />
          <SongList />
        </div>

        <Player />
      </div>
    </AudioPlayerProvider>
  );
}

export default App;

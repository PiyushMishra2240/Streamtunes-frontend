import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserSongList from "./components/UserSongList";
import SongList from "./components/SongList";
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import Analytics from "./components/Analytics";
import LoginPage from "./components/LoginPage";
import { useAuth } from "./context/AuthContext";
import { useAudioPlayer } from "./context/AudioPlayerContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppShell() {
  const { user, logout } = useAuth();
  const { stopPlayback } = useAudioPlayer();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getDisplayName = (username) => {
    if (!username) return "";
    if (username.includes("@")) {
      return username.split("@")[0];
    }
    return username;
  };

  const displayName = getDisplayName(user?.displayName || user?.username);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-green-500 to-emerald-700 shadow-lg flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-3xl font-bold tracking-wide whitespace-nowrap">
            🎵 StreamTunes
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs sm:text-sm font-medium opacity-90 hidden xs:inline">
            👋 {displayName}
          </span>
          <button
            onClick={() => { stopPlayback(); logout(); }}
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer shrink-0"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(0, 0, 0, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(0, 0, 0, 0.2)";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pb-28">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<UserSongList />} />
              <Route path="/global" element={<SongList />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      <Player />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

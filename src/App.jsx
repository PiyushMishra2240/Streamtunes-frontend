import { Routes, Route, Navigate } from "react-router-dom";
import UserSongList from "./components/UserSongList";
import SongList from "./components/SongList";
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import LoginPage from "./components/LoginPage";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppShell() {
  const { user, logout } = useAuth();

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
      <div className="px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-700 shadow-lg flex items-center justify-between shrink-0">
        <h1 className="text-3xl font-bold tracking-wide">
          🎵 StreamTunes
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium opacity-90">
            👋 {displayName}
          </span>
          <button
            onClick={logout}
            className="px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer"
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
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-10 pb-28">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<UserSongList />} />
              <Route path="/global" element={<SongList />} />
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

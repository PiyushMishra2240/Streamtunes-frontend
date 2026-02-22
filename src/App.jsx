import { Routes, Route, Navigate } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import SongList from "./components/SongList";
import Player from "./components/Player";
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
      <div className="px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-700 shadow-lg flex items-center justify-between">
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

      {/* Content */}
      <div className="flex-1 p-10 pb-28 space-y-10 max-w-5xl mx-auto w-full">
        <UploadForm />
        <SongList />
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

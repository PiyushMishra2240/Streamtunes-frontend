const Sidebar = () => {
  return (
    <div className="w-64 bg-zinc-900 p-6 border-r border-zinc-800">
      <h1 className="text-2xl font-bold mb-8">StreamTunes</h1>

      <nav className="space-y-4">
        <button className="block text-left w-full hover:text-emerald-400">
          🎵 All Songs
        </button>
        <button className="block text-left w-full hover:text-emerald-400">
          🔍 Search
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;

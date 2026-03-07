import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${
      isActive
        ? "bg-green-500/15 text-green-400 shadow-md shadow-green-500/5"
        : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
    }`;

  return (
    <aside className="w-60 bg-[#121212] border-r border-gray-800 p-5 flex flex-col gap-6 shrink-0">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 px-2">
          Library
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={linkClass}>
            <span className="text-lg">🎵</span>
            <span>Your Songs</span>
          </NavLink>
          <NavLink to="/global" className={linkClass}>
            <span className="text-lg">🌍</span>
            <span>Global Songs</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${
      isActive
        ? "bg-green-500/15 text-green-400 shadow-md shadow-green-500/5"
        : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
    }`;

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Overlay backdrop — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-64
          bg-[#121212] border-r border-gray-800 p-5 flex flex-col gap-6
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-60 lg:shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button — mobile only */}
        <div className="flex items-center justify-between lg:hidden">
          <span className="text-lg font-bold text-green-400">🎵 Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 px-2">
            Library
          </p>
          <nav className="flex flex-col gap-1">
            <NavLink to="/" end className={linkClass} onClick={handleNavClick}>
              <span className="text-lg">🎵</span>
              <span>Your Songs</span>
            </NavLink>
            <NavLink to="/global" className={linkClass} onClick={handleNavClick}>
              <span className="text-lg">🌍</span>
              <span>Global Songs</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

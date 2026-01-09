import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function DashboardMenu({ sidebarOpen, themeMode }) {
  return (
    <Link
      to="/dashboard"
      className={`group flex items-center px-3 py-2 mb-3 text-sm font-medium rounded-md
        ${
          themeMode === "light"
            ? "text-gray-700 hover:bg-blue-100"
            : "text-gray-300 hover:bg-blue-700"
        } transition-all duration-300 overflow-hidden whitespace-nowrap`}
    >
      <div className="flex-shrink-0 mr-3 text-lg">
        <FiHome />
      </div>

      <span
        style={{
          width: sidebarOpen ? "auto" : 0,
          opacity: sidebarOpen ? 1 : 0,
          transition: "opacity 0.3s, width 0.3s",
        }}
      >
        Dashboard
      </span>
    </Link>
  );
}

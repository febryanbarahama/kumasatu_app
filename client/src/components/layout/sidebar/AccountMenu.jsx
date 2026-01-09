import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

export default function AccountMenu({ sidebarOpen, themeMode, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/dashboard/account")}
      className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md
        ${
          themeMode === "light"
            ? "text-gray-700 hover:bg-blue-100"
            : "text-gray-300 hover:bg-blue-700"
        } transition-all duration-300 overflow-hidden whitespace-nowrap`}
    >
      <div className="flex-shrink-0 mr-3 text-lg">
        <FiSettings />
      </div>

      <span
        style={{
          width: sidebarOpen ? "auto" : 0,
          opacity: sidebarOpen ? 1 : 0,
          transition: "opacity 0.3s, width 0.3s",
        }}
      >
        Account
      </span>
    </button>
  );
}

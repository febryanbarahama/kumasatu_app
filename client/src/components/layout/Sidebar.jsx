// components/Layout/Sidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const menus = [{ name: "Dashboard", icon: <FiHome />, path: "/dashboard" }];

const accountMenus = [
  { name: "Account", icon: <FiUser />, path: "/dashboard/account" },
  { name: "Settings", icon: <FiSettings />, path: "/settings" },
  { name: "Logout", icon: <FiLogOut />, action: "logout" },
];

export default function Sidebar({
  sidebarOpen,
  themeMode,
  toggleSidebar,
  onMenuClick,
}) {
  const navigate = useNavigate();

  const handleMenuClick = (menu) => {
    if (menu.action === "logout") {
      onMenuClick(menu);
    } else if (menu.path) {
      navigate(menu.path);
    }
  };

  return (
    <aside
      className={`flex flex-col ${
        themeMode === "light"
          ? "bg-white border-gray-200"
          : "bg-gray-800 border-gray-700"
      } border-r transition-all duration-300 ${
        sidebarOpen ? "w-56" : "w-20"
      } overflow-visible relative`}
    >
      {/* Header sidebar */}
      <div
        className={`relative flex items-center h-16 border-b transition-padding duration-300 ${
          themeMode === "light" ? "border-gray-200" : "border-gray-700"
        } ${sidebarOpen ? "justify-center pr-0" : "justify-start pl-4 pr-8"}`}
      >
        <Link
          to="/dashboard"
          className="flex items-center overflow-hidden transition-all duration-300"
          title="Pemerintahan Kampung Kuma I"
          style={{
            width: sidebarOpen ? "auto" : "48px",
            minWidth: sidebarOpen ? undefined : "48px",
          }}
        >
          <img
            src="../src/assets/logo.png"
            alt="Logo Kampung"
            className="flex-shrink-0 w-10 h-10"
            style={{ display: "block" }}
          />
        </Link>

        <button
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          onClick={toggleSidebar}
          className={`absolute top-1/2 -right-4 z-30 transform -translate-y-1/2
            w-9 h-9 rounded-full flex items-center justify-center
            ${
              themeMode === "light"
                ? "bg-white border border-gray-300 hover:bg-blue-100"
                : "bg-gray-800 border border-gray-600 hover:bg-blue-700"
            } transition-transform duration-300 focus:outline-none`}
          style={{ boxShadow: "0 0 6px rgba(0,0,0,0.15)" }}
        >
          {sidebarOpen ? (
            <FiChevronLeft className="text-blue-600" size={22} />
          ) : (
            <FiChevronRight className="text-blue-600" size={22} />
          )}
        </button>
      </div>

      {/* Menu Utama */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            to={menu.path}
            className={`group flex items-center px-3 py-2 mb-3 text-sm font-medium rounded-md
              ${
                themeMode === "light"
                  ? "text-gray-700 hover:bg-blue-100"
                  : "text-gray-300 hover:bg-blue-700"
              } transition-all duration-300 ease-in-out
              overflow-hidden whitespace-nowrap
            `}
            style={{ transitionProperty: "width, opacity, margin" }}
          >
            <div className="flex-shrink-0 mr-3 text-lg">{menu.icon}</div>
            <span
              className="inline-block transition-all duration-300 ease-in-out"
              style={{
                width: sidebarOpen ? "auto" : 0,
                opacity: sidebarOpen ? 1 : 0,
              }}
            >
              {menu.name}
            </span>
          </Link>
        ))}

        {sidebarOpen && (
          <div className="flex items-center px-3 mb-3 select-none">
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Menu
            </span>
            <div className="flex-grow ml-2 border-t border-gray-400"></div>
          </div>
        )}

        {accountMenus.map((menu) => (
          <button
            key={menu.name}
            onClick={() => handleMenuClick(menu)}
            className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md
              ${
                themeMode === "light"
                  ? "text-gray-700 hover:bg-blue-100"
                  : "text-gray-300 hover:bg-blue-700"
              } transition-all duration-300 ease-in-out
              overflow-hidden whitespace-nowrap
              ${
                menu.action === "logout"
                  ? themeMode === "light"
                    ? "hover:text-red-600"
                    : "hover:text-red-400"
                  : ""
              }
            `}
            style={{ transitionProperty: "width, opacity, margin" }}
          >
            <div className="flex-shrink-0 mr-3 text-lg">{menu.icon}</div>
            <span
              className="inline-block transition-all duration-300 ease-in-out"
              style={{
                width: sidebarOpen ? "auto" : 0,
                opacity: sidebarOpen ? 1 : 0,
              }}
            >
              {menu.name}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

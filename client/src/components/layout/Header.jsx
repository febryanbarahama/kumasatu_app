import React, { useState, useRef, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContexts.jsx";

export default function Header({ themeMode, changeThemeMode, style }) {
  const [modeDropdown, setModeDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const modeRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleModeDropdown = () => setModeDropdown((prev) => !prev);
  const toggleProfileDropdown = () => setProfileDropdown((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modeRef.current && !modeRef.current.contains(event.target)) {
        setModeDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ModeIcon = () => {
    if (themeMode === "light") return <FiSun className="text-yellow-400" />;
    if (themeMode === "dark") return <FiMoon className="text-gray-600" />;
    return <FiSun className="text-yellow-400" />;
  };

  return (
    <header
      style={style} // menerima style dari parent (full width)
      className={`relative flex items-center justify-end h-16 px-6 space-x-4 border-b transition-colors duration-300 ${
        themeMode === "light"
          ? "bg-white border-gray-200"
          : "bg-gray-800 border-gray-700"
      }`}
    >
      <div className="relative flex items-center space-x-4">
        {/* Mode toggle with dropdown */}
        <div ref={modeRef} className="relative">
          <button
            onClick={toggleModeDropdown}
            aria-haspopup="true"
            aria-expanded={modeDropdown}
            aria-label="Toggle theme mode dropdown"
            className={`flex items-center p-2 rounded-md focus:outline-none ${
              themeMode === "light" ? "hover:bg-gray-200" : "hover:bg-gray-700"
            }`}
          >
            <ModeIcon />
          </button>
          <div
            className={`absolute right-0 z-50 w-40 py-2 mt-2 rounded-md shadow-lg transition-transform transition-opacity origin-top-right
              ${
                modeDropdown
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }
              ${
                themeMode === "light"
                  ? "bg-white border border-gray-200"
                  : "bg-gray-700 border border-gray-600"
              }
            `}
          >
            <button
              onClick={() => changeThemeMode("light")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600
              ${
                themeMode === "light"
                  ? "bg-blue-100 dark:bg-blue-600 font-semibold"
                  : ""
              }
            `}
            >
              <FiSun className="mr-2 text-yellow-400" /> Light
            </button>
            <button
              onClick={() => changeThemeMode("dark")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600
              ${
                themeMode === "dark"
                  ? "bg-blue-100 dark:bg-blue-600 font-semibold"
                  : ""
              }
            `}
            >
              <FiMoon className="mr-2 text-gray-600" /> Dark
            </button>
          </div>
        </div>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center space-x-2 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={profileDropdown}
            aria-label="User menu"
          >
            <img
              src="../src/assets/avatar.png"
              alt="User Avatar"
              className={`object-cover w-8 h-8 border rounded-full ${
                themeMode === "light" ? "border-gray-300" : "border-gray-600"
              }`}
            />
          </button>

          <div
            className={`absolute right-0 z-50 w-48 py-2 mt-2 rounded-md shadow-lg transition-transform transition-opacity origin-top-right
            ${
              profileDropdown
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }
            ${
              themeMode === "light"
                ? "bg-white border border-gray-200"
                : "bg-gray-700 border border-gray-600"
            }`}
          >
            <div
              className={`flex items-center px-4 py-3 space-x-3 border-b ${
                themeMode === "light" ? "border-gray-200" : "border-gray-600"
              }`}
            >
              <img
                src="../src/assets/avatar.png"
                alt="User Avatar"
                className={`object-cover w-10 h-10 border rounded-full ${
                  themeMode === "light" ? "border-gray-300" : "border-gray-600"
                }`}
              />
              <div>
                <p
                  className={`text-sm font-semibold ${
                    themeMode === "light" ? "text-gray-900" : "text-gray-100"
                  }`}
                >
                  {user?.name || user?.username || "User"}
                </p>
                <p
                  className={`max-w-xs text-xs truncate ${
                    themeMode === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {user?.email || ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                navigate("/account");
                setProfileDropdown(false);
              }}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600 ${
                themeMode === "light" ? "text-gray-700" : "text-gray-200"
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
                setProfileDropdown(false);
              }}
              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

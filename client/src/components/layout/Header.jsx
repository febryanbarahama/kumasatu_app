import React, { useState, useRef, useEffect } from "react";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContexts.jsx";

export default function Header({ themeMode, changeThemeMode, style }) {
  const [modeDropdown, setModeDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // 🔹 State modal konfirmasi

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
    if (themeMode === "light")
      return <FiSun className="text-lg text-yellow-400 " />;
    if (themeMode === "dark")
      return <FiMoon className="text-lg text-gray-600" />;
    return <FiSun className="text-yellow-400" />;
  };

  const getUserInitials = () => {
    const name = user?.name || user?.username || "U";
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const handleConfirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutConfirm(false);
    setProfileDropdown(false);
  };

  return (
    <>
      <header
        style={style}
        className={`z-10 flex items-center justify-end h-16 px-6 space-x-4 border-b transition-colors duration-300 ${
          themeMode === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-800 border-gray-700"
        }`}
      >
        <div className="relative flex items-center space-x-4">
          {/* Mode toggle */}
          <div ref={modeRef} className="relative">
            <button
              onClick={toggleModeDropdown}
              className={`flex items-center p-2 rounded-md focus:outline-none ${
                themeMode === "light"
                  ? "hover:bg-gray-200"
                  : "hover:bg-gray-700"
              }`}
            >
              <ModeIcon />
            </button>
            {modeDropdown && (
              <div
                className={`absolute right-0 z-50 w-40 py-2 mt-2 rounded-md shadow-lg border ${
                  themeMode === "light"
                    ? "bg-white border-gray-200"
                    : "bg-gray-700 border-gray-600"
                }`}
              >
                <button
                  onClick={() => changeThemeMode("light")}
                  className={`flex items-center w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-gray-600 ${
                    themeMode === "light"
                      ? "bg-blue-100 dark:bg-blue-600 font-semibold"
                      : ""
                  }`}
                >
                  <FiSun className="mr-2 text-lg text-yellow-400" /> Light
                </button>
                <button
                  onClick={() => changeThemeMode("dark")}
                  className={`flex items-center w-full px-4 py-2 text-sm  text-gray-600 dark:text-gray-400   hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    themeMode === "dark" ? "bg-gray-900 font-semibold" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mr-2 text-lg font-semibold">
                    <FiMoon />
                  </div>
                  Dark
                </button>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                  themeMode === "light" ? "bg-blue-500" : "bg-blue-400"
                }`}
              >
                {getUserInitials()}
              </div>
            </button>

            {profileDropdown && (
              <div
                className={`absolute right-0 z-50 w-48 py-2 mt-2 rounded-md shadow-lg border ${
                  themeMode === "light"
                    ? "bg-white border-gray-200"
                    : "bg-gray-700 border-gray-600"
                }`}
              >
                <div
                  className={`flex items-center px-4 py-3 space-x-3 border-b ${
                    themeMode === "light"
                      ? "border-gray-200"
                      : "border-gray-600"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                      themeMode === "light" ? "bg-blue-500" : "bg-blue-400"
                    }`}
                  >
                    {getUserInitials()}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        themeMode === "light"
                          ? "text-gray-900"
                          : "text-gray-100"
                      }`}
                    >
                      {user?.name || user?.username || "User"}
                    </p>
                    <p
                      className={`max-w-xs text-xs truncate ${
                        themeMode === "light"
                          ? "text-gray-500"
                          : "text-gray-400"
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
                    setShowLogoutConfirm(true); // 🔹 Tampilkan modal
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm font-semibold text-left hover:text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700"
                >
                  <div className="flex-shrink-0 mr-1 text-lg font-semibold">
                    <FiLogOut />
                  </div>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🔹 Modal Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            className={`p-6 rounded-lg shadow-lg w-80 ${
              themeMode === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                themeMode === "light" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              Konfirmasi Logout
            </h2>
            <p
              className={`text-sm mb-6 ${
                themeMode === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              Apakah Anda yakin ingin keluar dari akun?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm text-gray-800 bg-gray-300 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

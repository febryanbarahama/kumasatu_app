// components/Layout/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const setThemeMode = (mode) => {
  localStorage.setItem("theme-mode", mode);
  if (mode === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else if (mode === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [themeMode, setThemeModeState] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") || "light";
    setThemeModeState(savedMode);
    setThemeMode(savedMode);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const changeThemeMode = (mode) => {
    setThemeModeState(mode);
    setThemeMode(mode);
  };

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        themeMode === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
      data-theme={themeMode}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        themeMode={themeMode}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex flex-col flex-1">
        <Header themeMode={themeMode} changeThemeMode={changeThemeMode} />

        <main
          className={`flex-1 p-6 overflow-auto transition-colors duration-300 ${
            themeMode === "light" ? "bg-gray-50" : "bg-gray-900"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
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

  const sidebarWidth = sidebarOpen ? 224 : 80;
  const headerHeight = 64;
  const paddingExtra = 16;

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        themeMode === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
      data-theme={themeMode}
    >
      {/* Sidebar fixed di kiri atas, menimpa header */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        themeMode={themeMode}
        toggleSidebar={toggleSidebar}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: sidebarWidth,
          zIndex: 50,
        }}
      />

      {/* Header full width, fixed di atas */}
      <Header
        themeMode={themeMode}
        changeThemeMode={changeThemeMode}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw", // penuh lebar viewport
          height: headerHeight,
          zIndex: 40, // di bawah sidebar
        }}
      />

      {/* Konten utama dengan padding ekstra */}
      <main
        className={`flex-1 overflow-auto transition-colors duration-300     ${
          themeMode === "light"
            ? "bg-gray-50 text-gray-900"
            : "bg-gray-900 text-gray-100"
        }`}
        style={{
          paddingTop: headerHeight + paddingExtra,
          paddingLeft: sidebarWidth + paddingExtra,
          paddingRight: paddingExtra,
          paddingBottom: paddingExtra,
          height: `calc(100vh - ${headerHeight}px)`,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import DashboardMenu from "./DashboardMenu";
import AccountMenu from "./AccountMenu";
import PendudukMenu from "./PendudukMenu";
import InformasiMenu from "./InformasiMenu";
import GalleryMenu from "./GalleryMenu";
import ProfilKampungMenu from "./ProfilKampungMenu";
import LayananMenu from "./LayananMenu";

export default function Sidebar({
  sidebarOpen,
  themeMode,
  toggleSidebar,
  style,
}) {
  return (
    <aside
      style={style}
      className={`${
        themeMode === "light"
          ? "bg-white border-gray-200"
          : "bg-gray-800 border-gray-700"
      } border-r transition-all duration-300`}
    >
      {/* === BUTTON TOGGLE === */}
      <button
        aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
        title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
        onClick={toggleSidebar}
        className={`absolute top-4 -right-4 z-50 
          w-9 h-9 rounded-full flex items-center justify-center
          ${
            themeMode === "light"
              ? "bg-white border border-gray-300 hover:bg-blue-100 text-blue-600"
              : "bg-gray-800 border border-gray-600 hover:bg-blue-700 text-blue-600 hover:text-white"
          } transition-all duration-300`}
      >
        {sidebarOpen ? (
          <FiChevronLeft size={22} />
        ) : (
          <FiChevronRight size={22} />
        )}
      </button>

      {/* === LOGO AREA === */}
      <div
        className={`relative flex items-center h-16 border-b transition-padding duration-300 ${
          themeMode === "light" ? "border-gray-200" : "border-gray-700"
        } ${sidebarOpen ? "justify-center pr-0" : "justify-start pl-4 pr-8"}`}
      >
        <Link
          to="/dashboard"
          className="flex items-center overflow-hidden transition-all duration-300"
          style={{
            width: sidebarOpen ? "auto" : "48px",
            minWidth: sidebarOpen ? undefined : "48px",
          }}
        >
          <img src="/logo.png" alt="Logo Kampung" className="w-10 h-10" />
        </Link>
      </div>

      {/* === MENU AREA === */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {/* Dashboard */}
        <DashboardMenu sidebarOpen={sidebarOpen} themeMode={themeMode} />

        {/* Separator */}
        {sidebarOpen && (
          <div className="flex items-center px-3 mb-3 select-none">
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Menu
            </span>
            <div className="flex-grow ml-2 border-t border-gray-400"></div>
          </div>
        )}

        {/* Account */}
        <AccountMenu
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          themeMode={themeMode}
        />

        {/* Penduduk Dropdown */}
        <PendudukMenu
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          themeMode={themeMode}
        />

        {/* Informasi Dropdown */}
        <InformasiMenu
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          themeMode={themeMode}
        />

        <ProfilKampungMenu
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          themeMode={themeMode}
        />

        <LayananMenu
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          themeMode={themeMode}
        />

        {/* Gallery */}
        <GalleryMenu
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          themeMode={themeMode}
        />
      </nav>
    </aside>
  );
}

// src/components/sidebar/LayananMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMonitor, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function LayananMenu({ sidebarOpen, themeMode, toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [wantToOpenAfterSidebar, setWantToOpenAfterSidebar] = useState(false);
  const ref = useRef(null);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    function clickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  /* ================= AFTER SIDEBAR OPEN ================= */
  useEffect(() => {
    if (sidebarOpen && wantToOpenAfterSidebar) {
      setOpen(true);
      setWantToOpenAfterSidebar(false);
    }
  }, [sidebarOpen, wantToOpenAfterSidebar]);

  /* ================= HANDLER ================= */
  const handleClick = () => {
    if (!sidebarOpen) {
      setWantToOpenAfterSidebar(true);
      toggleSidebar();
      return;
    }

    setOpen((prev) => !prev);
  };

  /* ================= UI ================= */
  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleClick}
        className={`group flex items-center w-full px-3 py-2 mt-1 text-sm font-medium rounded-md
          ${
            themeMode === "light"
              ? "text-gray-700 hover:bg-blue-100"
              : "text-gray-300 hover:bg-blue-700"
          }
          transition-all duration-300 overflow-hidden whitespace-nowrap`}
      >
        {/* ICON */}
        <div className="mr-3 text-lg">
          <FiMonitor />
        </div>

        {/* LABEL */}
        <span
          className="flex-1 text-left"
          style={{
            width: sidebarOpen ? "auto" : 0,
            opacity: sidebarOpen ? 1 : 0,
            transition: "opacity 0.3s, width 0.3s",
          }}
        >
          Layanan
        </span>

        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {/* DROPDOWN */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Link
          to="/dashboard/layanan/administrasi"
          className={`block px-10 py-2 text-sm rounded-md ${
            themeMode === "light"
              ? "text-gray-700 hover:bg-blue-100"
              : "text-gray-300 hover:bg-blue-700"
          }`}
        >
          Administrasi
        </Link>

        <Link
          to="/dashboard/layanan/pengaduan"
          className={`block px-10 py-2 text-sm rounded-md ${
            themeMode === "light"
              ? "text-gray-700 hover:bg-blue-100"
              : "text-gray-300 hover:bg-blue-700"
          }`}
        >
          Pengaduan
        </Link>
      </div>
    </div>
  );
}

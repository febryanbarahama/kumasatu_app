import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function PendudukMenu({
  sidebarOpen,
  themeMode,
  toggleSidebar,
}) {
  const [open, setOpen] = useState(false);
  const [wantToOpenAfterSidebar, setWantToOpenAfterSidebar] = useState(false);
  const ref = useRef(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function clickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  useEffect(() => {
    if (sidebarOpen && wantToOpenAfterSidebar) {
      setOpen(true);
      setWantToOpenAfterSidebar(false);
    }
  }, [sidebarOpen]);

  const handleClick = () => {
    if (!sidebarOpen) {
      setWantToOpenAfterSidebar(true);
      toggleSidebar();
      return;
    }

    setOpen(!open);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleClick}
        className={`group flex items-center w-full px-3 py-2 mt-1 text-sm font-medium rounded-md
          ${
            themeMode === "light"
              ? "text-gray-700 hover:bg-blue-100"
              : "text-gray-300 hover:bg-blue-700"
          } transition-all duration-300 overflow-hidden whitespace-nowrap`}
      >
        <div className="mr-3 text-lg">
          <FiUsers />
        </div>

        {/* Label */}
        <span
          className="flex-1 text-left"
          style={{
            width: sidebarOpen ? "auto" : 0,
            opacity: sidebarOpen ? 1 : 0,
            transition: "opacity 0.3s, width 0.3s",
          }}
        >
          Penduduk
        </span>

        <div>{open ? <FiChevronUp /> : <FiChevronDown />}</div>
      </button>

      {/* Dropdown */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Link
          to="/dashboard/penduduk/keluarga"
          className={`block px-10 py-2 text-sm rounded-md ${
            themeMode === "light"
              ? "text-gray-700 hover:bg-blue-100"
              : "text-gray-300 hover:bg-blue-700"
          }`}
        >
          Keluarga
        </Link>

        <Link
          to="/dashboard/penduduk/individu"
          className={`block px-10 py-2 text-sm rounded-md ${
            themeMode === "light"
              ? "text-gray-700 hover:bg-blue-100"
              : "text-gray-300 hover:bg-blue-700"
          }`}
        >
          Individu
        </Link>
      </div>
    </div>
  );
}

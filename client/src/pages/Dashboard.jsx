// import React, { useState, useEffect, useRef } from "react";
// import {
//   FiHome,
//   FiUser,
//   FiSettings,
//   FiLogOut,
//   FiChevronLeft,
//   FiChevronRight,
//   FiSun,
//   FiMoon,
// } from "react-icons/fi";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/authContexts.jsx";

// const menus = [{ name: "Dashboard", icon: <FiHome />, path: "/dashboard" }];

// const accountMenus = [
//   { name: "Account", icon: <FiUser />, path: "/account" },
//   { name: "Settings", icon: <FiSettings />, path: "/settings" },
//   { name: "Logout", icon: <FiLogOut />, action: "logout" },
// ];

// const setThemeMode = (mode) => {
//   localStorage.setItem("theme-mode", mode);
//   if (mode === "light") {
//     document.documentElement.setAttribute("data-theme", "light");
//   } else if (mode === "dark") {
//     document.documentElement.setAttribute("data-theme", "dark");
//   } else {
//     document.documentElement.removeAttribute("data-theme");
//   }
// };

// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [profileDropdown, setProfileDropdown] = useState(false);
//   const [modeDropdown, setModeDropdown] = useState(false);
//   const [themeMode, setThemeModeState] = useState("light");

//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   // Close dropdowns on outside click
//   const profileRef = useRef(null);
//   const modeRef = useRef(null);

//   useEffect(() => {
//     const savedMode = localStorage.getItem("theme-mode") || "light";
//     setThemeModeState(savedMode);
//     setThemeMode(savedMode);
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setProfileDropdown(false);
//       }
//       if (modeRef.current && !modeRef.current.contains(event.target)) {
//         setModeDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

//   const toggleModeDropdown = () => setModeDropdown((prev) => !prev);

//   const changeThemeMode = (mode) => {
//     setThemeModeState(mode);
//     setThemeMode(mode);
//     setModeDropdown(false);
//   };

//   const toggleProfileDropdown = () => setProfileDropdown((prev) => !prev);

//   const handleMenuClick = (menu) => {
//     if (menu.action === "logout") {
//       logout();
//       navigate("/login");
//     } else if (menu.path) {
//       navigate(menu.path);
//     }
//     setProfileDropdown(false);
//     setModeDropdown(false);
//   };

//   const ModeIcon = () => {
//     if (themeMode === "light") return <FiSun className="text-yellow-400" />;
//     if (themeMode === "dark") return <FiMoon className="text-gray-600" />;
//     return <FiSun className="text-yellow-400" />;
//   };

//   return (
//     <div
//       className={`flex h-screen transition-colors duration-300 ${
//         themeMode === "light" ? "bg-gray-100" : "bg-gray-900"
//       }`}
//       data-theme={themeMode}
//     >
//       {/* Sidebar */}
//       <aside
//         className={`flex flex-col ${
//           themeMode === "light"
//             ? "bg-white border-gray-200"
//             : "bg-gray-800 border-gray-700"
//         } border-r transition-all duration-300 ${
//           sidebarOpen ? "w-56" : "w-20"
//         } overflow-visible relative`}
//       >
//         {/* Header sidebar */}
//         <div
//           className={`relative flex items-center h-16 border-b transition-padding duration-300 ${
//             themeMode === "light" ? "border-gray-200" : "border-gray-700"
//           } ${sidebarOpen ? "justify-center pr-0" : "justify-start pl-4 pr-8"}`}
//         >
//           <Link
//             to="/dashboard"
//             className="flex items-center overflow-hidden transition-all duration-300"
//             title="Pemerintahan Kampung Kuma I"
//             style={{
//               width: sidebarOpen ? "auto" : "48px",
//               minWidth: sidebarOpen ? undefined : "48px",
//             }}
//           >
//             <img
//               src="../src/assets/logo.png"
//               alt="Logo Kampung"
//               className="flex-shrink-0 w-10 h-10"
//               style={{ display: "block" }}
//             />
//           </Link>

//           <button
//             aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
//             title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
//             onClick={toggleSidebar}
//             className={`absolute top-1/2 -right-4 z-30 transform -translate-y-1/2
//               w-9 h-9 rounded-full flex items-center justify-center
//               ${
//                 themeMode === "light"
//                   ? "bg-white border border-gray-300 hover:bg-blue-100"
//                   : "bg-gray-800 border border-gray-600 hover:bg-blue-700"
//               } transition-transform duration-300 focus:outline-none`}
//             style={{ boxShadow: "0 0 6px rgba(0,0,0,0.15)" }}
//           >
//             {sidebarOpen ? (
//               <FiChevronLeft className="text-blue-600" size={22} />
//             ) : (
//               <FiChevronRight className="text-blue-600" size={22} />
//             )}
//           </button>
//         </div>

//         {/* Menu Utama */}
//         <nav className="flex-1 px-2 py-4 overflow-y-auto">
//           {menus.map((menu) => (
//             <Link
//               key={menu.name}
//               to={menu.path}
//               className={`group flex items-center px-3 py-2 mb-3 text-sm font-medium rounded-md
//                 ${
//                   themeMode === "light"
//                     ? "text-gray-700 hover:bg-blue-100"
//                     : "text-gray-300 hover:bg-blue-700"
//                 } transition-all duration-300 ease-in-out
//                 overflow-hidden whitespace-nowrap
//               `}
//               onClick={() => {
//                 setProfileDropdown(false);
//                 setModeDropdown(false);
//               }}
//               style={{ transitionProperty: "width, opacity, margin" }}
//             >
//               <div className="flex-shrink-0 mr-3 text-lg">{menu.icon}</div>
//               <span
//                 className="inline-block transition-all duration-300 ease-in-out"
//                 style={{
//                   width: sidebarOpen ? "auto" : 0,
//                   opacity: sidebarOpen ? 1 : 0,
//                 }}
//               >
//                 {menu.name}
//               </span>
//             </Link>
//           ))}

//           {sidebarOpen && (
//             <div className="flex items-center px-3 mb-3 select-none">
//               <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
//                 Menu
//               </span>
//               <div className="flex-grow ml-2 border-t border-gray-400"></div>
//             </div>
//           )}

//           {accountMenus.map((menu) => (
//             <button
//               key={menu.name}
//               onClick={() => handleMenuClick(menu)}
//               className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md
//                 ${
//                   themeMode === "light"
//                     ? "text-gray-700 hover:bg-blue-100"
//                     : "text-gray-300 hover:bg-blue-700"
//                 } transition-all duration-300 ease-in-out
//                 overflow-hidden whitespace-nowrap
//                 ${
//                   menu.action === "logout"
//                     ? themeMode === "light"
//                       ? "hover:text-red-600"
//                       : "hover:text-red-400"
//                     : ""
//                 }
//               `}
//               style={{ transitionProperty: "width, opacity, margin" }}
//             >
//               <div className="flex-shrink-0 mr-3 text-lg">{menu.icon}</div>
//               <span
//                 className="inline-block transition-all duration-300 ease-in-out"
//                 style={{
//                   width: sidebarOpen ? "auto" : 0,
//                   opacity: sidebarOpen ? 1 : 0,
//                 }}
//               >
//                 {menu.name}
//               </span>
//             </button>
//           ))}
//         </nav>
//       </aside>

//       {/* Main content */}
//       <div className="flex flex-col flex-1">
//         <header
//           className={`relative flex items-center justify-end h-16 px-6 space-x-4 border-b transition-colors duration-300 ${
//             themeMode === "light"
//               ? "bg-white border-gray-200"
//               : "bg-gray-800 border-gray-700"
//           }`}
//         >
//           <div className="relative flex items-center space-x-4">
//             {/* Mode toggle with dropdown */}
//             <div ref={modeRef} className="relative">
//               <button
//                 onClick={toggleModeDropdown}
//                 aria-haspopup="true"
//                 aria-expanded={modeDropdown}
//                 aria-label="Toggle theme mode dropdown"
//                 className={`flex items-center p-2 rounded-md focus:outline-none ${
//                   themeMode === "light"
//                     ? "hover:bg-gray-200"
//                     : "hover:bg-gray-700"
//                 }`}
//               >
//                 <ModeIcon />
//               </button>
//               <div
//                 className={`absolute right-0 z-50 w-40 py-2 mt-2 rounded-md shadow-lg transition-transform transition-opacity origin-top-right
//                   ${
//                     modeDropdown
//                       ? "opacity-100 scale-100 pointer-events-auto"
//                       : "opacity-0 scale-95 pointer-events-none"
//                   }
//                   ${
//                     themeMode === "light"
//                       ? "bg-white border border-gray-200"
//                       : "bg-gray-700 border border-gray-600"
//                   }
//                 `}
//               >
//                 <button
//                   onClick={() => changeThemeMode("light")}
//                   className={`flex items-center w-full px-4 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600
//                   ${
//                     themeMode === "light"
//                       ? "bg-blue-100 dark:bg-blue-600 font-semibold"
//                       : ""
//                   }
//                 `}
//                 >
//                   <FiSun className="mr-2 text-yellow-400" /> Light
//                 </button>
//                 <button
//                   onClick={() => changeThemeMode("dark")}
//                   className={`flex items-center w-full px-4 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600
//                   ${
//                     themeMode === "dark"
//                       ? "bg-blue-100 dark:bg-blue-600 font-semibold"
//                       : ""
//                   }
//                 `}
//                 >
//                   <FiMoon className="mr-2 text-gray-600" /> Dark
//                 </button>
//               </div>
//             </div>

//             {/* Profile dropdown */}
//             <div ref={profileRef} className="relative">
//               <button
//                 onClick={toggleProfileDropdown}
//                 className="flex items-center space-x-2 focus:outline-none"
//                 aria-haspopup="true"
//                 aria-expanded={profileDropdown}
//                 aria-label="User menu"
//               >
//                 <img
//                   src="../src/assets/avatar.png"
//                   alt="User Avatar"
//                   className={`object-cover w-8 h-8 border rounded-full ${
//                     themeMode === "light"
//                       ? "border-gray-300"
//                       : "border-gray-600"
//                   }`}
//                 />
//               </button>

//               <div
//                 className={`absolute right-0 z-50 w-48 py-2 mt-2 rounded-md shadow-lg transition-transform transition-opacity origin-top-right
//                 ${
//                   profileDropdown
//                     ? "opacity-100 scale-100 pointer-events-auto"
//                     : "opacity-0 scale-95 pointer-events-none"
//                 }
//                 ${
//                   themeMode === "light"
//                     ? "bg-white border border-gray-200"
//                     : "bg-gray-700 border border-gray-600"
//                 }`}
//               >
//                 <div
//                   className={`flex items-center px-4 py-3 space-x-3 border-b ${
//                     themeMode === "light"
//                       ? "border-gray-200"
//                       : "border-gray-600"
//                   }`}
//                 >
//                   <img
//                     src="../src/assets/avatar.png"
//                     alt="User Avatar"
//                     className={`object-cover w-10 h-10 border rounded-full ${
//                       themeMode === "light"
//                         ? "border-gray-300"
//                         : "border-gray-600"
//                     }`}
//                   />
//                   <div>
//                     <p
//                       className={`text-sm font-semibold ${
//                         themeMode === "light"
//                           ? "text-gray-900"
//                           : "text-gray-100"
//                       }`}
//                     >
//                       {user?.name || user?.username || "User"}
//                     </p>
//                     <p
//                       className={`max-w-xs text-xs truncate ${
//                         themeMode === "light"
//                           ? "text-gray-500"
//                           : "text-gray-400"
//                       }`}
//                     >
//                       {user?.email || ""}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     navigate("/account");
//                     setProfileDropdown(false);
//                   }}
//                   className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600 ${
//                     themeMode === "light" ? "text-gray-700" : "text-gray-200"
//                   }`}
//                 >
//                   My Profile
//                 </button>
//                 <button
//                   onClick={() => {
//                     logout();
//                     navigate("/login");
//                     setProfileDropdown(false);
//                   }}
//                   className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-600"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main
//           className={`flex-1 p-6 overflow-auto transition-colors duration-300 ${
//             themeMode === "light" ? "bg-gray-50" : "bg-gray-900"
//           }`}
//         >
//           {/* Welcome message */}
//           <h1
//             className={`text-2xl font-semibold mb-6 ${
//               themeMode === "light" ? "text-gray-900" : "text-gray-100"
//             }`}
//           >
//             Selamat datang, {user?.name || user?.username || "Pengguna"}!
//           </h1>

//           {/* Main content */}
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// pages/DashboardPage.jsx
import React from "react";
import { useAuth } from "../contexts/authContexts.jsx";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">
        Selamat datang, {user?.name || user?.username || "Pengguna"}!
      </h1>
      <p>Ini adalah halaman dashboard.</p>
    </div>
  );
}

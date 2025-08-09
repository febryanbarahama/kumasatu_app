import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ onLogout }) {
  return (
    <nav className="p-4 flex justify-between bg-gray-100">
      <div>
        <Link to="/">DesaKu</Link>
      </div>
      <div className="space-x-3">
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

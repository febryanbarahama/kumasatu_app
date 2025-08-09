import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // tunggu proses autentikasi selesai

  if (!user) return <Navigate to="/login" replace />; // jika belum login, redirect ke login

  return children; // jika sudah login, render children (dashboard dll)
};

export default ProtectedRoute;

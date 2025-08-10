import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/authContexts.jsx";
import Login from "./pages/Login.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Keluarga from "./pages/Keluarga.jsx";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Dashboard layout route */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            {/* Default dashboard content */}
            <Route index element={<Dashboard />} />
            {/* Route untuk Account */}
            <Route path="account" element={<AccountPage />} />
            <Route path="penduduk/keluarga" element={<Keluarga />} />
            {/* <Route path="penduduk/individu" element={<Individu />} /> */}
            {/* Route lain bisa ditambahkan di sini */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

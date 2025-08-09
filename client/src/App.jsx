import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/authContexts.jsx";
import Login from "./pages/Login.jsx";
import DashboardPage from "./pages/DashboardPage.jsx"; // layout dashboard
import Dashboard from "./pages/Dashboard.jsx"; // halaman dashboard
import AccountPage from "./pages/AccountPage.jsx"; // halaman account
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
            {/* Route lain bisa ditambahkan di sini */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/authContexts.jsx";
import Login from "./pages/Login.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Keluarga from "./pages/Keluarga.jsx";
import KeluargaForm from "./components/keluarga/KeluargaForm.jsx";
import Individu from "./pages/Individu.jsx";
import IndividuForm from "./components/individu/IndividuForm.jsx";
import BeritaPage from "./pages/BeritaPage.jsx";
import BeritaForm from "./components/berita/BeritaForm.jsx";
import AgendaPage from "./pages/AgendaPage.jsx";
import AgendaForm from "./components/agenda/AgendaForm.jsx";
import GaleriPage from "./pages/GalleryPage.jsx";
import GaleriForm from "./components/galeri/GaleriForm.jsx";
import AparaturListPage from "./pages/AparaturPage.jsx";
import AparaturForm from "./components/aparatur/AparaturForm.jsx";
import AdministrasiPage from "./pages/AdministrasiPage.jsx";
import PengaduanPage from "./pages/PengaduanPage.jsx";

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

            {/* Route untuk Keluarga */}
            <Route path="penduduk/keluarga" element={<Keluarga />} />
            <Route
              path="penduduk/keluarga/add"
              element={<KeluargaForm isEdit={false} />}
            />
            <Route
              path="penduduk/keluarga/edit/:no_kk"
              element={<KeluargaForm isEdit={true} />}
            />

            {/* Route untuk Individu */}
            <Route path="penduduk/individu" element={<Individu />} />
            <Route
              path="penduduk/individu/add"
              element={<IndividuForm isEdit={false} />}
            />
            <Route
              path="penduduk/individu/edit/:nik"
              element={<IndividuForm isEdit={true} />}
            />

            {/* Route untuk Berita */}
            <Route path="informasi/berita" element={<BeritaPage />} />
            <Route
              path="informasi/berita/add"
              element={<BeritaForm isEdit={false} />}
            />
            <Route
              path="informasi/berita/edit/:id"
              element={<BeritaForm isEdit={true} />}
            />

            {/* Route untuk Agenda*/}
            <Route path="informasi/agenda" element={<AgendaPage />} />
            <Route
              path="informasi/agenda/add"
              element={<AgendaForm isEdit={false} />}
            />
            <Route
              path="informasi/agenda/edit/:id"
              element={<AgendaForm isEdit={true} />}
            />

            {/* Route untuk Galeri */}
            <Route path="galeri" element={<GaleriPage />} />
            <Route path="galeri/add" element={<GaleriForm isEdit={false} />} />
            <Route
              path="galeri/edit/:id"
              element={<GaleriForm isEdit={true} />}
            />

            {/* Route untuk Aparatur */}
            <Route
              path="profil-kampung/aparatur"
              element={<AparaturListPage />}
            />
            <Route
              path="profil-kampung/aparatur/add"
              element={<AparaturForm isEdit={false} />}
            />
            <Route
              path="profil-kampung/aparatur/edit/:id"
              element={<AparaturForm isEdit={true} />}
            />

            {/* Route untuk Layanan Persuratan */}
            <Route path="layanan/administrasi" element={<AdministrasiPage />} />

            {/* Route untuk Layanan pengaduan */}
            <Route path="layanan/pengaduan" element={<PengaduanPage />} />

            {/* Route lain bisa ditambahkan di sini */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

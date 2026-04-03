import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/authContexts.jsx";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 🔥 CONFIG GLOBAL
NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.2,
});

// =========================
// LAZY LOAD PAGES
// =========================
const Login = lazy(() => import("./pages/Login.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const AccountPage = lazy(() => import("./pages/AccountPage.jsx"));

const Keluarga = lazy(() => import("./pages/Keluarga.jsx"));
const KeluargaForm = lazy(
  () => import("./components/keluarga/KeluargaForm.jsx"),
);

const Individu = lazy(() => import("./pages/Individu.jsx"));
const IndividuForm = lazy(
  () => import("./components/individu/IndividuForm.jsx"),
);

const BeritaPage = lazy(() => import("./pages/BeritaPage.jsx"));
const BeritaForm = lazy(() => import("./components/berita/BeritaForm.jsx"));

const AgendaPage = lazy(() => import("./pages/AgendaPage.jsx"));
const AgendaForm = lazy(() => import("./components/agenda/AgendaForm.jsx"));

const GaleriPage = lazy(() => import("./pages/GalleryPage.jsx"));
const GaleriForm = lazy(() => import("./components/galeri/GaleriForm.jsx"));

const AparaturListPage = lazy(() => import("./pages/AparaturPage.jsx"));
const AparaturForm = lazy(
  () => import("./components/aparatur/AparaturForm.jsx"),
);

const AdministrasiPage = lazy(() => import("./pages/AdministrasiPage.jsx"));
const PengaduanPage = lazy(() => import("./pages/PengaduanPage.jsx"));

// NON-LAZY (WAJIB CEPAT)
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// =========================
// PUBLIC ROUTE
// =========================
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

// =========================
// APP
// =========================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 🔥 Suspense global */}
        <Suspense fallback={null}>
          <Routes>
            {/* Redirect root */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* =========================
                DASHBOARD (PROTECTED)
            ========================= */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            >
              {/* Default */}
              <Route index element={<Dashboard />} />

              {/* Account */}
              <Route path="account" element={<AccountPage />} />

              {/* PENDUDUK */}
              <Route path="penduduk/keluarga" element={<Keluarga />} />
              <Route
                path="penduduk/keluarga/add"
                element={<KeluargaForm isEdit={false} />}
              />
              <Route
                path="penduduk/keluarga/edit/:no_kk"
                element={<KeluargaForm isEdit={true} />}
              />

              <Route path="penduduk/individu" element={<Individu />} />
              <Route
                path="penduduk/individu/add"
                element={<IndividuForm isEdit={false} />}
              />
              <Route
                path="penduduk/individu/edit/:nik"
                element={<IndividuForm isEdit={true} />}
              />

              {/* INFORMASI */}
              <Route path="informasi/berita" element={<BeritaPage />} />
              <Route
                path="informasi/berita/add"
                element={<BeritaForm isEdit={false} />}
              />
              <Route
                path="informasi/berita/edit/:id"
                element={<BeritaForm isEdit={true} />}
              />

              <Route path="informasi/agenda" element={<AgendaPage />} />
              <Route
                path="informasi/agenda/add"
                element={<AgendaForm isEdit={false} />}
              />
              <Route
                path="informasi/agenda/edit/:id"
                element={<AgendaForm isEdit={true} />}
              />

              {/* GALERI */}
              <Route path="galeri" element={<GaleriPage />} />
              <Route
                path="galeri/add"
                element={<GaleriForm isEdit={false} />}
              />
              <Route
                path="galeri/edit/:id"
                element={<GaleriForm isEdit={true} />}
              />

              {/* PROFIL */}
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

              {/* LAYANAN */}
              <Route
                path="layanan/administrasi"
                element={<AdministrasiPage />}
              />
              <Route path="layanan/pengaduan" element={<PengaduanPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

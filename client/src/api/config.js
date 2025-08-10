import axios from "axios";

// Buat instance axios dengan baseURL sesuai env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // supaya cookie (refresh token) ikut dikirim
});

// Fungsi untuk attach access token ke header Authorization
export const attachToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Response interceptor (bisa tambah handle error global)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bisa tambahkan handler khusus misal auto refresh token jika 401
    return Promise.reject(error);
  }
);

export default api;

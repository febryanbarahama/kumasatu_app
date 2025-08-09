import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // penting supaya cookie (refresh token) ikut terkirim
});

// Fungsi untuk attach access token ke header Authorization
export const attachToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Response interceptor: di sini bisa ditambah handling 401 jika mau auto-refresh token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // biarkan authContext yang handle refresh token
    return Promise.reject(error);
  }
);

export default api;

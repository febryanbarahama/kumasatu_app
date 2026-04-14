import axios from "axios";
import NProgress from "nprogress";

/* =========================
   MAIN API INSTANCE
========================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🔥 WAJIB untuk cookie refresh token
});

/* =========================
   REFRESH CLIENT (NO INTERCEPTOR)
========================= */
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* =========================
   NPROGRESS CONFIG
========================= */
NProgress.configure({
  showSpinner: false,
  speed: 500,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

/* =========================
   REFRESH HANDLER
========================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/* =========================
   ATTACH TOKEN
========================= */
export const attachToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    /* =========================
       HANDLE 401 (REFRESH TOKEN)
    ========================= */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") // 🔥 ANTI LOOP
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .finally(() => {
            NProgress.done();
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshClient.post("/api/auth/refresh"); // ✅ FIX UTAMA
        const newToken = res.data.accessToken;

        attachToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = "Bearer " + newToken;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // 🔥 OPTIONAL: redirect ke login kalau refresh gagal
        if (err.response?.status === 401) {
          attachToken(null);
          window.location.href = "/login";
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        NProgress.done();
      }
    }

    NProgress.done();
    return Promise.reject(error);
  },
);

export default api;

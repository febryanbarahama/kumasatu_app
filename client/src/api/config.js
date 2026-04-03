import axios from "axios";
import NProgress from "nprogress";

const api = axios.create({
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
    NProgress.done(); // ✅ WAJIB
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    /* =========================
       HANDLE 401 (REFRESH)
    ========================= */
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .finally(() => {
            NProgress.done(); // ✅ pastikan selesai
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/api/auth/refresh");
        const newToken = res.data.accessToken;

        attachToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = "Bearer " + newToken;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        NProgress.done(); // ✅ WAJIB
      }
    }

    NProgress.done(); // ✅ kalau error biasa
    return Promise.reject(error);
  },
);

export default api;

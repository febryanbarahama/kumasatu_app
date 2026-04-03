import React, { createContext, useContext, useState, useEffect } from "react";
import api, { attachToken } from "../api/config.js";
import NProgress from "nprogress";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     HELPERS
  ========================= */

  const setToken = (token) => {
    setAccessToken(token);
    attachToken(token);
  };

  const clearAuth = () => {
    setAccessToken(null);
    setUser(null);
    attachToken(null);
  };

  /* =========================
     AUTH ACTIONS
  ========================= */

  // LOGIN
  const login = async ({ username, password }) => {
    try {
      const res = await api.post("/api/auth/login", {
        username,
        password,
      });

      const { accessToken: token, id, name, email, username: uname } = res.data;

      setToken(token);
      setUser({
        id,
        name,
        email,
        username: uname,
      });

      return res.data;
    } finally {
      NProgress.done(); // jaga-jaga kalau dipanggil manual
    }
  };

  // REGISTER
  const register = async (payload) => {
    try {
      const res = await api.post("/api/auth/register", payload);

      const { accessToken: token, id, name, email, username } = res.data;

      if (token) {
        setToken(token);
        setUser({ id, name, email, username });
      }

      return res.data;
    } finally {
      NProgress.done();
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      // ignore server error
    } finally {
      clearAuth();
    }
  };

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("fetchProfile error:", err);
      clearAuth();
      throw err;
    }
  };

  /* =========================
     INIT AUTH (PENTING)
  ========================= */

  useEffect(() => {
    const initAuth = async () => {
      try {
        // ⚠️ Tidak perlu NProgress.start()
        // karena axios interceptor sudah handle

        const res = await api.post("/api/auth/refresh");

        setToken(res.data.accessToken);

        await fetchProfile();
      } catch (err) {
        clearAuth();
      } finally {
        setLoading(false);
        NProgress.done(); // pastikan stop
      }
    };

    initAuth();
  }, []);

  /* =========================
     CONTEXT VALUE
  ========================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,

        login,
        register,
        logout,
        fetchProfile,

        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

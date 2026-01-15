import React, { createContext, useContext, useState, useEffect } from "react";
import api, { attachToken } from "../api/config.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // helper: set token and header
  const setToken = (token) => {
    setAccessToken(token);
    attachToken(token);
  };

  // fetch profile using current access token
  const fetchProfile = async () => {
    if (!accessToken) return;
    try {
      const res = await api.get("api/auth/profile"); // uses Authorization header
      setUser(res.data);
    } catch (err) {
      console.error("fetchProfile err", err);
    }
  };

  // refresh access token using refresh cookie
  const refreshAccessToken = async () => {
    try {
      const res = await api.post("api/auth/refresh"); // cookie automatically sent
      const { accessToken: newToken } = res.data;
      if (newToken) {
        setToken(newToken);
        return newToken;
      }
    } catch (err) {
      console.log("refresh failed", err?.response?.data || err);
      setToken(null);
      setUser(null);
    }
    return null;
  };

  // login
  const login = async ({ username, password }) => {
    const res = await api.post("api/auth/login", { username, password });
    const { accessToken: token, id, name, email, username: uname } = res.data;
    setToken(token);
    setUser({ id, name, email, username: uname });
    return res.data;
  };

  // register
  const register = async (payload) => {
    const res = await api.post("api/auth/register", payload);
    // backend sets refresh cookie and returns access token
    const { accessToken: token, id, name, email, username } = res.data;
    if (token) {
      setToken(token);
      setUser({ id, name, email, username });
    }
    return res.data;
  };

  // logout
  const logout = async () => {
    try {
      await api.post("api/auth/logout"); // backend clears cookie + DB
    } catch (err) {
      // ignore
    }
    setToken(null);
    setUser(null);
  };

  // on mount: try refresh token to get accessToken (silent auth)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.post("api/auth/refresh");
        const newToken = res.data.accessToken;
        if (newToken) {
          setToken(newToken);
          // fetch profile after token set
          const profile = await api.get("api/auth/profile");
          setUser(profile.data);
        }
      } catch (err) {
        // not logged in
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  // helper to call protected API; will auto-refresh on 401 then retry (optional)
  const requestWithAutoRefresh = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await fn(); // retry original fn
        }
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        register,
        logout,
        refreshAccessToken,
        requestWithAutoRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

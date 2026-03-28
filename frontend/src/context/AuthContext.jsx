import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";

const STORAGE_KEY = "booking-movie-auth";
const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: "", user: null };
  } catch {
    return { token: "", user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.token) {
      setAuthToken(auth.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      setAuthToken("");
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  useEffect(() => {
    const bootstrap = async () => {
      const stored = readStoredAuth();

      if (!stored.token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(stored.token);
        const res = await api.get("/auth/me");
        setAuth({ token: stored.token, user: res.data.user });
      } catch {
        setAuth({ token: "", user: null });
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = (payload) => {
    setAuth(payload);
  };

  const logout = () => {
    setAuth({ token: "", user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated: Boolean(auth.token && auth.user),
        isAdmin: auth.user?.role === "admin",
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

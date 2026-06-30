import { createContext, useContext, useMemo, useState  } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [ token, setToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [user, setUser] = useState(() => {
    try{
        const raw = localStorage.getItem("user");
        return raw && raw !== "undefined" ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
  });
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken") || "");

  async function refresh() {
    if (!refreshToken) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } else {
        logout();
      }
    } catch (err) {
      console.error("Erro ao atualizar token:", err);
      logout();
    }
  }

  function login({ accessToken, refreshToken, user }) {
    setToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  }


  function logout() {
    setToken("");
    setRefreshToken("");
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }


  const value = useMemo(() => ({ token, user, login, logout, refresh }), [token, user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  return ctx;
}

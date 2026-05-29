import type { ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import type { MockUser } from "../services/mockApi";
import { getCurrentUser, logout as apiLogout } from "../services/mockApi";
import { AuthContext } from "./auth-context";

const STORAGE_KEYS = {
  TOKEN: "feedple_auth_token",
  USER: "feedple_auth_user",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Omit<MockUser, "password"> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        // Verify token is still valid
        const result = await getCurrentUser(storedToken);
        if (result.success && result.user) {
          setToken(storedToken);
          setUser(result.user);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    const loadSession = async () => {
      await restoreSession();
    };
    loadSession();
  }, [restoreSession]);

  const login = useCallback(
    (newUser: Omit<MockUser, "password">, newToken: string) => {
      setUser(newUser);
      setToken(newToken);
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

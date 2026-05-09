import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  authAPI,
  usersAPI,
  setTokens,
  clearTokens,
  getAccessToken,
} from "@/lib/services/api";
  import type { User } from "@/lib/services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUserProfile: () => Promise<User | null>;
  setUserPlan: (plan: User["plan"]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          const currentUser = await usersAPI.getCurrentProfile();
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        const errorMessage = err instanceof Error ? err.message : "";
        if (!errorMessage.includes("Failed to fetch")) {
          clearTokens();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(data);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const refreshUserProfile = async (): Promise<User | null> => {
    try {
      const currentUser = await usersAPI.getCurrentProfile();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      console.error("Failed to refresh user profile:", err);
      return null;
    }
  };

  const setUserPlan = (plan: User["plan"]) => {
    setUser((prev) => {
      if (!prev || prev.plan === plan) {
        return prev;
      }
      return { ...prev, plan };
    });
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUserProfile,
    setUserPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../utils/api";

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isPrivate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User> | FormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);

          // Optionally verify token is still valid by fetching profile in the background
          // This will update the user data if successful, or the authenticatedFetch
          // will handle redirect to login if token is invalid
          api
            .getProfile()
            .then((profileResponse) => {
              if (profileResponse && profileResponse.user) {
                setUser(profileResponse.user);
                localStorage.setItem(
                  "user",
                  JSON.stringify(profileResponse.user)
                );
              }
            })
            .catch((error) => {
              // If verification fails, the authenticatedFetch will handle the logout
              console.error("Background token verification failed:", error);
            });
        } catch (error) {
          // Failed to parse stored user, clear storage
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.login(credentials);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
  };

  const register = async (userData: {
    email: string;
    username: string;
    password: string;
  }) => {
    await api.register(userData);
    // After registration, automatically log in
    await login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const updateProfile = async (profileData: Partial<User> | FormData) => {
    const response = await api.updateProfile(profileData);
    setUser(response.user);
    localStorage.setItem("user", JSON.stringify(response.user));
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

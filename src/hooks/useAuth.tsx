"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User } from "@/lib/types";
import { getCurrentUser, isAuthenticated as checkAuthenticated } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = () => {
    console.log("refreshAuth called");
    console.log("localStorage authToken:", localStorage.getItem("authToken"));
    console.log("localStorage user:", localStorage.getItem("user"));

    try {
      const currentUser = getCurrentUser();
      console.log("currentUser: ", currentUser);
      const authStatus = checkAuthenticated();
      console.log("authStatus: ", authStatus);

      setUser(currentUser);
      setIsAuthenticated(authStatus);

      console.log("Auth state updated:", { user: currentUser, isAuthenticated: authStatus });
    } catch (error) {
      console.error("Error refreshing auth:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

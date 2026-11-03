"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api"; // Aapka Axios instance with withCredentials: true
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Page refresh par session verify karna (/api/auth/me)
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Cookie automatically browser ke through backend par jayegi
        const response = await api.get("/auth/me");
        
        // Aapke backend getMe response me user 'data' ke andar hai
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  // 2. Login Function
  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const userData = response.data.data; // Backend response 

      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please check your credentials.",
      };
    }
  };

  // 3. Logout Function
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // Backend cookie clear
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
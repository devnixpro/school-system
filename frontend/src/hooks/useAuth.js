"use client";
import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const { user, token, loading, login, logout } = useAuthContext();
  return {
    user, token, loading, login, logout,
    isAuthenticated: !!token && !!user,
    hasRole: (...roles) => !!user && roles.includes(user.role),
  };
}

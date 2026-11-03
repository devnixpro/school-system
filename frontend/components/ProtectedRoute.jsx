"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 1. Agar user logged in nahi hai -> Login page par bhej dein
      if (!user) {
        router.push("/login");
        return;
      }

      // 2. Agar user ka role allowed roles me nahi hai -> Uske sahi dashboard par bhej dein
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        redirectBasedOnRole(user.role, router);
      }
    }
  }, [user, loading, allowedRoles, router]);

  // Jab tak user data fetch ho raha hai, Loading state dikhayein
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // Agar role matched hai tabhi content render hoga
  return allowedRoles.includes(user.role) ? children : null;
}

// Role ke hisab se sahi dashboard par redirect karne ka helper function
export function redirectBasedOnRole(role, router) {
  switch (role) {
    case "superadmin":
    case "admin":
      router.push("/dashboard/admin");
      break;
    case "teacher":
      router.push("/dashboard/teacher");
      break;
    case "student":
      router.push("/dashboard/student");
      break;
    case "parent":
      router.push("/dashboard/parent");
      break;
    default:
      router.push("/login");
  }
}
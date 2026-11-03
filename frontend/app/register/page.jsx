"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { redirectBasedOnRole } from "@/components/ProtectedRoute";

export default function RegisterPage() {
  const [schools, setSchools] = useState([]); // 👈 Schools list store karne ke liye
  const [formData, setFormData] = useState({
    schoolId: "", // Ab yahan dropdown se selected school ki _id ayegi
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // 🏫 Page load hote hi active schools fetch karein
  // 🏫 Page load hote hi active schools fetch karein
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get("/auth/public/schools"); // 👈 Yahan '/auth' add kar diya gaya hai
        if (response.data?.success) {
          setSchools(response.data.data);
          // Agar schools maujood hain toh pehle wale ko default select kardein
          if (response.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, schoolId: response.data.data[0]._id }));
          }
        }
      } catch (err) {
        console.error("Failed to load schools:", err);
        setError("Could not load schools list. Please refresh the page.");
      }
    };

    fetchSchools();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.schoolId) {
      setError("Please select your school!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        schoolId: formData.schoolId, // Selected school ki ID backend par ja rahi hai
        role: formData.role,
      });

      if (response.data.success) {
        const userRole = response.data.data.role;
        redirectBasedOnRole(userRole, router);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Register your pre-approved account on DevNixEdu
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800 bg-white cursor-pointer"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* 🏫 School Name Dropdown (Replaced School ID text input) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select School Name
            </label>
            <select
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800 bg-white cursor-pointer"
            >
              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Abdul Basit"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address *(Must be added by Admin)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@school.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash text-base"></i>
                ) : (
                  <i className="fa-solid fa-eye text-base"></i>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Verifying & Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        toast.success("Login Successful");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Login Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-medical flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-green-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <HospitalIcon className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900">
              Hospital AI CRM
            </h1>

            <p className="text-gray-600 mt-3">
              Welcome back! Please login to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4"
              />

              <span className="text-gray-700 text-sm">
                Remember Me
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          {/* Demo */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-bold text-green-700 mb-2">
              Demo Credentials
            </h3>

            <p className="text-gray-700">
              Email:
              <code className="ml-2 bg-white px-2 py-1 rounded">
                admin@example.com
              </code>
            </p>

            <p className="text-gray-700 mt-2">
              Password:
              <code className="ml-2 bg-white px-2 py-1 rounded">
                admin123
              </code>
            </p>
          </div>
        </div>

        <p className="text-center mt-5 text-sm text-gray-700">
          © 2026 Hospital AI CRM
        </p>
      </motion.div>
    </div>
  );
}

function HospitalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-5 11h-2v2h-2v-2H8v-2h2V8h2v4h2v2z" />
    </svg>
  );
}

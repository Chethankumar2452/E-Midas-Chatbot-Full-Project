"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardNav() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rememberedEmail");
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="glass-bg border-b border-white/20 dark:border-slate-700/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">
          Dashboard
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

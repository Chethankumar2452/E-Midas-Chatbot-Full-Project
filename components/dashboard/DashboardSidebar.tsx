"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  Mail,
  TrendingUp,
  Settings,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Filter, label: "Leads", href: "/dashboard/leads" },
    { icon: Users, label: "Patients", href: "/dashboard/patients" },
    { icon: Stethoscope, label: "Doctors", href: "/dashboard/doctors" },
    { icon: Building2, label: "Clinics", href: "/dashboard/clinics" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
    { icon: Mail, label: "Email Templates", href: "/dashboard/emails" },
    { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 glass-bg border-r border-white/20 dark:border-slate-700/20 p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 11h-2v2h-2v-2h-2v-2h2V8h2v4h2v2z" />
          </svg>
        </div>
        <span className="font-bold text-lg text-gray-900 dark:text-white">
          Hospital CRM
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
  ? "bg-blue-600 text-white shadow-lg"
  : "text-gray-700 dark:text-gray-300 hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-white/20 dark:border-slate-700/20">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Hospital AI CRM
        </p>
      </div>
    </aside>
  );
}

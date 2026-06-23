"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        toast.error("Failed to fetch analytics");
      }
    } catch (error) {
      toast.error("Error fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-gray-500">Failed to load analytics</div>;
  }

  const monthlyData = [
    { week: "Week 1", leads: 5, appointments: 12, revenue: 6000 },
    { week: "Week 2", leads: 8, appointments: 15, revenue: 7500 },
    { week: "Week 3", leads: 6, appointments: 18, revenue: 9000 },
    { week: "Week 4", leads: 9, appointments: 14, revenue: 7000 },
  ];

  const doctorBookings = [
    { name: "Dr. Smith", bookings: 45 },
    { name: "Dr. Johnson", bookings: 38 },
    { name: "Dr. Williams", bookings: 35 },
    { name: "Dr. Brown", bookings: 28 },
    { name: "Dr. Davis", bookings: 22 },
  ];

  const appointmentTrends = [
    { month: "January", completed: 45, pending: 12, cancelled: 3 },
    { month: "February", completed: 52, pending: 14, cancelled: 5 },
    { month: "March", completed: 48, pending: 16, cancelled: 4 },
    { month: "April", completed: 61, pending: 18, cancelled: 6 },
    { month: "May", completed: 55, pending: 15, cancelled: 3 },
    { month: "June", completed: 58, pending: 20, cancelled: 5 },
  ];

  const AnalyticsCard = ({
    icon: Icon,
    label,
    value,
    subtext,
    color,
    index,
  }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive insights into your hospital operations
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          icon={Users}
          label="Total Conversions"
          value={`${Math.round((stats.totalPatients / stats.totalLeads) * 100)}%`}
          subtext={`${stats.totalPatients} patients from ${stats.totalLeads} leads`}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
          index={0}
        />
        <AnalyticsCard
          icon={Calendar}
          label="Monthly Appointments"
          value={stats.monthlyAppointments}
          subtext="Past 30 days"
          color="bg-gradient-to-r from-purple-500 to-pink-500"
          index={1}
        />
        <AnalyticsCard
          icon={TrendingUp}
          label="Avg. per Doctor"
          value={Math.round(stats.monthlyAppointments / stats.totalDoctors)}
          subtext={`From ${stats.totalDoctors} doctors`}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
          index={2}
        />
        <AnalyticsCard
          icon={DollarSign}
          label="Estimated Revenue"
          value={`₹${(stats.revenue / 1000).toFixed(1)}K`}
          subtext="Based on appointments"
          color="bg-gradient-to-r from-orange-500 to-red-500"
          index={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Activity Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F6FDD" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0F6FDD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#0F6FDD"
                fillOpacity={1}
                fill="url(#colorLeads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Doctor Performance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Doctors by Bookings
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={doctorBookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="bookings" fill="#06B6D4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Appointment Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appointment Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Statistics Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
              TOTAL LEADS
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalLeads}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
              TOTAL PATIENTS
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalPatients}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
              ACTIVE DOCTORS
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalDoctors}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
              CLINICS
            </p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.totalClinics}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

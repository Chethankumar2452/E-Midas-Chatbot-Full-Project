"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, Stethoscope, Building2, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalLeads: number;
  totalPatients: number;
  totalDoctors: number;
  totalClinics: number;
  appointmentsToday: number;
  monthlyLeads: number;
  monthlyAppointments: number;
  topDoctors: Array<{ _id: string; count: number }>;
  revenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        toast.error("Failed to fetch statistics");
      }
    } catch (error) {
      toast.error("Error fetching statistics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    index,
  }: {
    icon: any;
    label: string;
    value: number;
    color: string;
    index: number;
  }) => (
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
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

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
    return <div className="text-center text-gray-500">Failed to load statistics</div>;
  }

  const chartData = [
    { month: "Week 1", leads: stats.monthlyLeads / 4, appointments: stats.monthlyAppointments / 4 },
    { month: "Week 2", leads: stats.monthlyLeads / 4, appointments: stats.monthlyAppointments / 4 },
    { month: "Week 3", leads: stats.monthlyLeads / 4, appointments: stats.monthlyAppointments / 4 },
    { month: "Week 4", leads: stats.monthlyLeads / 4, appointments: stats.monthlyAppointments / 4 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's an overview of your hospital metrics.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={TrendingUp}
          label="Total Leads"
          value={stats.totalLeads}
          color="bg-gradient-primary"
          index={0}
        />
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.totalPatients}
          color="bg-gradient-to-r from-cyan-500 to-blue-500"
          index={1}
        />
        <StatCard
          icon={Stethoscope}
          label="Total Doctors"
          value={stats.totalDoctors}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
          index={2}
        />
        <StatCard
          icon={Building2}
          label="Total Clinics"
          value={stats.totalClinics}
          color="bg-gradient-to-r from-orange-500 to-red-500"
          index={3}
        />
        <StatCard
          icon={Calendar}
          label="Appointments Today"
          value={stats.appointmentsToday}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
          index={4}
        />
        <StatCard
          icon={DollarSign}
          label="Revenue (Est.)"
          value={stats.revenue}
          color="bg-gradient-to-r from-yellow-500 to-orange-500"
          index={5}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#0F6FDD"
                strokeWidth={2}
                dot={{ fill: "#0F6FDD", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: "#06B6D4", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Patients", value: stats.totalPatients },
                  { name: "Leads", value: stats.totalLeads },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#0F6FDD" />
                <Cell fill="#06B6D4" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Leads</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.monthlyLeads}
            </p>
          </div>
          <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Appointments</p>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {stats.monthlyAppointments}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. per Doctor</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalDoctors > 0 ? Math.round(stats.monthlyAppointments / stats.totalDoctors) : 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalLeads > 0 ? Math.round((stats.totalPatients / stats.totalLeads) * 100) : 0}%
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

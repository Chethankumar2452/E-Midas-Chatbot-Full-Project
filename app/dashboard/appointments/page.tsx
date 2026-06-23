"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    doctor: "",
    clinic: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, [search]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/appointments?search=${search}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.data);
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Appointment booked successfully");
        setFormData({
          patientName: "",
          phone: "",
          email: "",
          doctor: "",
          clinic: "",
          date: "",
          time: "",
          notes: "",
        });
        setShowForm(false);
        fetchAppointments();
      } else {
        toast.error("Failed to book appointment");
      }
    } catch (error) {
      toast.error("Error booking appointment");
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/appointments?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Appointment cancelled");
        fetchAppointments();
        setDeleteConfirm(null);
      }
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
       <button
  onClick={() => setShowForm(true)}
  className="flex gap-2 px-4 py-2 rounded-xl
  bg-blue-500/20
  backdrop-blur-xl
  border border-blue-300/30
  text-blue-700 dark:text-blue-300
  font-medium
  shadow-[0_8px_32px_rgba(59,130,246,0.25)]
  hover:bg-blue-500/30
  hover:border-blue-400/50
  transition-all duration-300"
>
  <Plus className="w-4 h-4" />
  Book Appointment
</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search appointments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <motion.div className="glass-card">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No appointments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Doctor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Clinic</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, i) => (
                  <motion.tr
                    key={apt._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/30 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{apt.patientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{apt.doctor}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(apt.date).toLocaleDateString()} {apt.time}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{apt.clinic}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button className="p-2 hover:bg-white/20 rounded-lg transition">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(apt._id)}
                        className="p-2 hover:bg-white/20 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Book Appointment Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Book Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Patient Name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Doctor Name"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Clinic Name"
                value={formData.clinic}
                onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-sky-100 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-200 transition"
                >
                  Cancel
                </button>
               <button
  type="submit"
  className="flex-1 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-medium rounded-lg shadow-md transition"
>
  Book Appointment
</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card max-w-sm p-6 m-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Cancel Appointment?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition"
              >
                Keep
              </button>
              <button
                onClick={() => deleteAppointment(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Cancel Appointment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

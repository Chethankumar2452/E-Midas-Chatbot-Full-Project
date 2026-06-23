"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Search } from "lucide-react";

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    fetchClinics();
  }, [search]);

  const fetchClinics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/clinics?search=${search}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClinics(data.data);
      }
    } catch (error) {
      toast.error("Failed to load clinics");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/clinics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Clinic added successfully");
        setFormData({
          clinicName: "",
          address: "",
          city: "",
          phone: "",
          email: "",
          website: "",
        });
        setShowForm(false);
        fetchClinics();
      } else {
        toast.error("Failed to add clinic");
      }
    } catch (error) {
      toast.error("Error adding clinic");
    }
  };

  const deleteClinic = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/clinics?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Clinic deleted");
        fetchClinics();
        setDeleteConfirm(null);
      }
    } catch (error) {
      toast.error("Failed to delete clinic");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clinics</h1>
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
  Add Clinic
</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search clinics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="glass-card">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : clinics.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No clinics found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Clinic</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic._id} className="border-b border-white/10 hover:bg-white/30 transition">
                    <td className="px-6 py-4 text-sm font-medium">{clinic.clinicName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{clinic.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{clinic.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{clinic.phone}</td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button className="p-2 hover:bg-white/20 rounded-lg transition">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(clinic._id)}
                        className="p-2 hover:bg-white/20 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Clinic Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Clinic</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Clinic Name"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                placeholder="Website (optional)"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3 pt-4">
                <button
  type="button"
  onClick={() => setShowForm(false)}
  className="flex-1 px-4 py-2 rounded-xl
  bg-gradient-to-r from-green-500/20 to-emerald-500/20
  backdrop-blur-xl
  border border-green-300/40
  text-green-700
  font-semibold
  shadow-lg
  hover:from-green-500/30 hover:to-emerald-500/30
  transition-all duration-300"
>
  Cancel
</button>
                <button
  type="submit"
  className="flex-1 px-4 py-2 rounded-xl
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
  Add Clinic
</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card max-w-sm p-6 m-4">
            <h3 className="text-lg font-semibold mb-4">Delete Clinic?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteClinic(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

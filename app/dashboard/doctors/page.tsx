
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Search, X } from "lucide-react";

interface Doctor {
  _id: string;
  doctorName: string;
  specialization: string;
  clinic: string;
  qualification?: string;
  experience?: number;
  status: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    doctorName: "",
    specialization: "",
    qualification: "",
    experience: 0,
    clinic: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, [search]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token") || "";

      const res = await fetch(
        `/api/doctors?search=${search}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setDoctors(data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token") || "";

      const res = await fetch(
        "/api/doctors",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            status: "active",
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Doctor added successfully"
        );

        setShowForm(false);

        setFormData({
          doctorName: "",
          specialization: "",
          qualification: "",
          experience: 0,
          clinic: "",
        });

        fetchDoctors();
      } else {
        toast.error(
          data.error ||
            "Failed to add doctor"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to add doctor"
      );
    }
  };

  const deleteDoctor = async (
    id: string
  ) => {
    try {
      const token =
        localStorage.getItem("token") || "";

      const res = await fetch(
        `/api/doctors?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        toast.success(
          "Doctor deleted"
        );
        fetchDoctors();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to delete doctor"
      );
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Doctors
        </h1>

        <button
          onClick={() =>
            setShowForm(true)
          }
          className="flex gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center">
            No doctors found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  Doctor
                </th>
                <th className="p-3 text-left">
                  Specialization
                </th>
                <th className="p-3 text-left">
                  Clinic
                </th>
                <th className="p-3 text-left">
                  Status
                </th>
                <th className="p-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {doctors.map(
                (doctor) => (
                  <tr
                    key={doctor._id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {
                        doctor.doctorName
                      }
                    </td>

                    <td className="p-3">
                      {
                        doctor.specialization
                      }
                    </td>

                    <td className="p-3">
                      {doctor.clinic}
                    </td>

                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                        {doctor.status}
                      </span>
                    </td>

                    <td className="p-3 flex justify-center gap-2">
                      <button>
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm(
                            doctor._id
                          )
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Add Doctor
              </h2>

              <button
                onClick={() =>
                  setShowForm(false)
                }
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={
                handleAddDoctor
              }
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Doctor Name"
                value={
                  formData.doctorName
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doctorName:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Specialization"
                value={
                  formData.specialization
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Qualification"
                value={
                  formData.qualification
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualification:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="number"
                placeholder="Experience"
                value={
                  formData.experience
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience:
                      Number(
                        e.target.value
                      ),
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Clinic"
                value={
                  formData.clinic
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clinic:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                Save Doctor
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl">

            <h3 className="font-bold mb-4">
              Delete Doctor?
            </h3>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteConfirm(
                    null
                  )
                }
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deleteDoctor(
                    deleteConfirm
                  )
                }
                className="bg-red-600 text-white px-4 py-2 rounded"
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


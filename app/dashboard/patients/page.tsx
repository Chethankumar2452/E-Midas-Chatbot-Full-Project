
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Edit, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteConfirm, setDeleteConfirm] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: 0,
  });

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") || "";

      const response = await fetch(
        `/api/patients?search=${search}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token") || "";

      const response = await fetch(
        "/api/patients",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Patient added successfully"
        );

        setShowForm(false);

        setFormData({
          name: "",
          email: "",
          phone: "",
          age: 0,
        });

        fetchPatients();
      } else {
        toast.error(
          data.error ||
            "Failed to add patient"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to add patient"
      );
    }
  };

  const deletePatient = async (
    id: string
  ) => {
    try {
      const token =
        localStorage.getItem("token") || "";

      const response = await fetch(
        `/api/patients?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(
          "Patient deleted successfully"
        );

        setDeleteConfirm(null);
        fetchPatients();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to delete patient"
      );
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Patients
        </h1>

        <button
          onClick={() =>
            setShowForm(true)
          }
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-10 pr-4 py-3 border rounded-lg"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center">
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No patients found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-6 py-3 text-left">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left">
                    Age
                  </th>
                  <th className="px-6 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {patients.map(
                  (patient) => (
                    <tr
                      key={patient._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {patient.name}
                      </td>

                      <td className="px-6 py-4">
                        {patient.email}
                      </td>

                      <td className="px-6 py-4">
                        {patient.phone}
                      </td>

                      <td className="px-6 py-4">
                        {patient.age}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">

                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteConfirm(
                                patient._id
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>
          </div>
        )}
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Add Patient
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
                handleAddPatient
              }
              className="space-y-3"
            >

              <input
                type="text"
                placeholder="Patient Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone:
                      e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    age: Number(
                      e.target.value
                    ),
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Save Patient
              </button>

            </form>

          </div>

        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h3 className="text-lg font-semibold mb-3">
              Delete Patient?
            </h3>

            <p className="text-gray-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setDeleteConfirm(null)
                }
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deletePatient(
                    deleteConfirm
                  )
                }
                className="flex-1 bg-red-600 text-white rounded-lg py-2"
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


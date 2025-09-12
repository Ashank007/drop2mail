import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Teacher {
  _id: string;
  name: string;
  email: string;
}


export default function TeachersTab() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [editModal, setEditModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);

  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const token = localStorage.getItem("token");

  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/teacher", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const data: Teacher[] = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this teacher?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/teacher/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete teacher");
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting teacher:", err);
    }
  };

  const openEditModal = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setFormData({ name: teacher.name, email: teacher.email, password: "" });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!currentTeacher) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/teacher/${currentTeacher._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update teacher");
      const updated = await res.json();
      setTeachers((prev) =>
        prev.map((t) => (t._id === updated.teacher._id ? updated.teacher : t))
      );
      setEditModal(false);
    } catch (err) {
      console.error("Error updating teacher:", err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/teacher/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to register teacher");
      await res.json();
      setAddModal(false);
      fetchTeachers(); // refresh list
    } catch (err) {
      console.error("Error adding teacher:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="p-6">
      {/* Header + Back + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">👨‍🏫 Manage Teachers</h1>
        <button
          onClick={() => {
            setFormData({ name: "", email: "", password: "" });
            setAddModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          ➕ Add Teacher
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading teachers...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, idx) => (
                <tr
                  key={t._id}
                  className={`border-b hover:bg-gray-50 transition ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3 text-gray-600">{t.email}</td>
                  <td className="p-3 flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(t)}
                      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {(editModal || addModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editModal ? "✏️ Edit Teacher" : "➕ Add Teacher"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Name"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Email"
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500"
                placeholder={editModal ? "New Password (optional)" : "Password"}
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setEditModal(false);
                  setAddModal(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={editModal ? handleUpdate : handleAdd}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {editModal ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



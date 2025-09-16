import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Student {
  _id: string;
  name: string;
  rollNo: string;
  email: string;
}

export default function TeacherStudentsTab() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
  });

  const token = localStorage.getItem("teacherToken");

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/student/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/student/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete student");
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const openEditModal = (student: Student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      email: student.email,
    });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!currentStudent) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/student/${currentStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to update student");
      const updated = await res.json();
      setStudents((prev) =>
        prev.map((s) => (s._id === updated.student._id ? updated.student : s))
      );
      setEditModal(false);
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/student/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add student");
      await res.json();
      setAddModal(false);
      fetchStudents();
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800">🎓 Manage Students</h1>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData({ name: "", rollNo: "", email: "" });
              setAddModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            ➕ Add Student
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("teacherToken");
              navigate("/teacher-login"); // login page ka route
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading students...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr
                  key={s._id}
                  className={`border-b hover:bg-gray-50 transition ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{s.rollNo}</td>
                  <td className="p-3 text-gray-600">{s.email}</td>
                  <td className="p-3 flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(s)}
                      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
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
              {editModal ? "✏️ Edit Student" : "➕ Add Student"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Name"
              />
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) =>
                  setFormData({ ...formData, rollNo: e.target.value })
                }
                className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Roll No"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500"
                placeholder="Email"
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



import { useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

export default function StudentList({ students, deleteStudent, editStudent }) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", roll: "" });

  const startEdit = (student) => {
    setEditId(student.id);
    setEditForm(student);
  };

  const handleSave = () => {
    editStudent(editId, editForm);
    setEditId(null);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Students List
      </h2>
      {students.length === 0 ? (
        <p className="text-gray-500">No students added yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Roll No</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="p-2 border">
                  {editId === student.id ? (
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="p-1 border rounded"
                    />
                  ) : (
                    student.name
                  )}
                </td>
                <td className="p-2 border">
                  {editId === student.id ? (
                    <input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="p-1 border rounded"
                    />
                  ) : (
                    student.email
                  )}
                </td>
                <td className="p-2 border">
                  {editId === student.id ? (
                    <input
                      value={editForm.roll}
                      onChange={(e) =>
                        setEditForm({ ...editForm, roll: e.target.value })
                      }
                      className="p-1 border rounded"
                    />
                  ) : (
                    student.roll
                  )}
                </td>
                <td className="p-2 border flex gap-2">
                  {editId === student.id ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(student)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


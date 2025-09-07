"use-client";
import { useState, useEffect } from "react";

const DragHandleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <circle cx="9" cy="12" r="1"></circle>
    <circle cx="9" cy="5" r="1"></circle>
    <circle cx="9" cy="19" r="1"></circle>
    <circle cx="15" cy="12" r="1"></circle>
    <circle cx="15" cy="5" r="1"></circle>
    <circle cx="15" cy="19" r="1"></circle>
  </svg>
);

export default function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/student");
      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await res.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/v1/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to add student. Please check the details.");
      }

      setName("");
      setEmail("");
      await fetchStudents();
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding student:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Student Roster</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage all the students in the system.
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto pr-2 mb-4 border rounded-lg">
        {students.length > 0 ? (
          <ul>
            {students.map((s: any) => (
              <li
                key={s._id}
                draggable
                className="flex items-center justify-between p-4 border-b last:border-b-0 bg-white hover:bg-gray-50 transition-colors duration-200 cursor-move"
              >
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.email}</p>
                </div>
                <DragHandleIcon />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No students found. Add a new student below.
          </p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isLoading || !name.trim() || !email.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Adding Student..." : "Add Student"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-right">{error}</p>}
      </form>
    </div>
  );
}


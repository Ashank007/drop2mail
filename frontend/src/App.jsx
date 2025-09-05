import { useState } from "react";
import CollectionList from "./components/CollectionList";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

export default function App() {
  const [activeTab, setActiveTab] = useState("collections");
  const [students, setStudents] = useState([]);

  // Add new student
  const addStudent = (student) => {
    setStudents([...students, { id: Date.now(), ...student }]);
  };

  // Delete student
  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  // Edit student
  const editStudent = (id, updated) => {
    setStudents(students.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Tabs */}
      <div className="flex bg-white shadow-md p-3 gap-4">
        <button
          onClick={() => setActiveTab("collections")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "collections"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Collections
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "students"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Students
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "collections" && <CollectionList />}
        {activeTab === "students" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <StudentForm addStudent={addStudent} />
            <StudentList
              students={students}
              deleteStudent={deleteStudent}
              editStudent={editStudent}
            />
          </div>
        )}
      </div>
    </div>
  );
}



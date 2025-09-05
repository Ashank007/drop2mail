import { useState } from "react";

export default function StudentForm({ addStudent }) {
  const [form, setForm] = useState({ name: "", email: "", roll: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.roll) return;
    addStudent(form);
    setForm({ name: "", email: "", roll: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">Add Student</h2>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-2 border rounded-lg"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded-lg"
      />
      <input
        type="text"
        name="roll"
        value={form.roll}
        onChange={handleChange}
        placeholder="Roll Number"
        className="w-full p-2 border rounded-lg"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
}


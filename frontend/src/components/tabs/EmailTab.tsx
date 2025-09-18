"use client";
import { useEffect, useState } from "react";

interface Collection {
  _id: string;
  title: string;
  students: { email: string; name?: string }[];
  teachers: { email: string; name?: string }[];
}

export default function EmailTab() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const token =
    localStorage.getItem("teacherToken") || localStorage.getItem("adminToken");
  const API_BASE_URL = "http://localhost:5000/api/v1";

  // --- Fetch collections on load ---
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/collection/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("Collections API response:", data);
        setCollections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching collections:", err);
        setCollections([]);
      }
    };

    if (token) fetchCollections();
  }, [token]);

  // --- Drag & Drop logic ---
  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const collection = collections.find((c) => c._id === data);

    if (collection) {
      const newEmails = [
        ...collection.students.map((s) => s.email),
        ...collection.teachers.map((t) => t.email),
      ];

      setSelectedEmails((prev) => Array.from(new Set([...prev, ...newEmails]))); // unique emails
    }
  };

  const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => ev.preventDefault();

  const sendEmail = () => {
    alert("📧 Sending email to:\n" + selectedEmails.join(", "));
    setSelectedEmails([]);
  };

  // --- UI ---
  return (
    <div className="flex gap-6">
      {/* Collections list */}
      <div className="w-1/3 p-4 border rounded-lg bg-white shadow">
        <h2 className="font-semibold mb-4">Drag Collections</h2>
        {collections.length > 0 ? (
          collections.map((c) => (
            <div
              key={c._id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text", c._id)}
              className="p-2 mb-2 border rounded bg-gray-100 cursor-grab hover:bg-gray-200 transition"
            >
              {c.title}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No collections found</p>
        )}
      </div>

      {/* Drop area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="flex-1 p-4 border-2 border-dashed rounded-lg bg-gray-50"
      >
        <h2 className="font-semibold mb-4">Drop here to Email</h2>
        {selectedEmails.length > 0 ? (
          <div>
            <p className="mb-2 text-sm text-gray-600">Recipients:</p>
            <ul className="mb-4 list-disc pl-5">
              {selectedEmails.map((email, i) => (
                <li key={i} className="text-sm">
                  {email}
                </li>
              ))}
            </ul>
            <button
              onClick={sendEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Send Email
            </button>
          </div>
        ) : (
          <p className="text-gray-400">Drop a collection here...</p>
        )}
      </div>
    </div>
  );
}



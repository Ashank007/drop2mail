"use client";
import { useState } from "react";

export default function EmailTab() {
  const [collections] = useState([
    { id: 1, title: "Math Group", students: ["aman@example.com", "priya@example.com"] },
    { id: 2, title: "Physics Group", students: ["rahul@example.com"] },
  ]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const collection = collections.find((c) => c.id.toString() === data);
    if (collection) {
      setSelectedEmails((prev) => [...prev, ...collection.students]);
    }
  };

  const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => ev.preventDefault();

  const sendEmail = () => {
    alert("Sending email to:\n" + selectedEmails.join(", "));
    setSelectedEmails([]);
  };

  return (
    <div className="flex gap-6">
      {/* Collections list */}
      <div className="w-1/3 p-4 border rounded-lg bg-white shadow">
        <h2 className="font-semibold mb-4">Drag Collections</h2>
        {collections.map((c) => (
          <div
            key={c.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text", c.id.toString())}
            className="p-2 mb-2 border rounded bg-gray-100 cursor-grab"
          >
            {c.title}
          </div>
        ))}
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
            <ul className="mb-4">
              {selectedEmails.map((email, i) => (
                <li key={i} className="text-sm">
                  {email}
                </li>
              ))}
            </ul>
            <button
              onClick={sendEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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



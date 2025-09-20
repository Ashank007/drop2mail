"use client";
import { useEffect, useState } from "react";

interface Collection {
  _id: string;
  title: string;
  students: { _id: string; email: string; name?: string }[];
  teachers: { _id: string; email: string; name?: string }[];
}

export default function EmailTab() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token =
    localStorage.getItem("teacherToken") || localStorage.getItem("adminToken");
  const API_BASE_URL = "http://localhost:5000/api/v1";

  // --- Fetch collections ---
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/collection/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
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
      const newStudentIds = collection.students.map((s) => s._id);
      const newTeacherIds = collection.teachers.map((t) => t._id);

      const allIds = [...newStudentIds, ...newTeacherIds];

      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };


  const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => ev.preventDefault();

  // --- Send Email ---
  const sendEmail = async () => {
    if (selectedStudentIds.length === 0) {
      alert("⚠️ No recipients selected!");
      return;
    }
    if (!subject || !message) {
      alert("⚠️ Please enter subject and message!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentIds: selectedStudentIds,
          subject,
          message,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(`✅ Email sent to: ${result.sentTo.join(", ")}`);
        setSelectedStudentIds([]);
        setSubject("");
        setMessage("");
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (err) {
      console.error("❌ Error sending email:", err);
      alert("❌ Failed to send email!");
    } finally {
      setLoading(false);
    }
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

      {/* Drop area + Email form */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="flex-1 p-4 border-2 border-dashed rounded-lg bg-gray-50"
      >
        <h2 className="font-semibold mb-4">Drop here to Email</h2>


      {selectedStudentIds.length > 0 ? (
        <div>
          <p className="mb-2 text-sm text-gray-600">
            Recipients: {selectedStudentIds.length} selected
          </p>

          {/* Recipients dropdown */}
          <div className="mb-4">
            {/* Students */}
            <details className="mb-2 border rounded">
              <summary className="cursor-pointer px-3 py-2 bg-gray-100 rounded-t font-medium">
                Students ({collections
                  .flatMap((c) => c.students)
                  .filter((s) => selectedStudentIds.includes(s._id)).length})
              </summary>
              <div className="p-3 space-y-1">
                {collections
                  .flatMap((c) => c.students)
                  .filter((s) => selectedStudentIds.includes(s._id))
                  .map((s) => (
                    <p key={s._id} className="text-sm text-gray-700">
                      {s.name || "Unnamed"} — <span className="text-blue-600">{s.email}</span>
                    </p>
                  ))}
              </div>
            </details>

            {/* Teachers */}
            <details className="border rounded">
              <summary className="cursor-pointer px-3 py-2 bg-gray-100 rounded-t font-medium">
                Teachers ({collections
                  .flatMap((c) => c.teachers)
                  .filter((t) => selectedStudentIds.includes(t._id)).length})
              </summary>
              <div className="p-3 space-y-1">
                {collections
                  .flatMap((c) => c.teachers)
                  .filter((t) => selectedStudentIds.includes(t._id))
                  .map((t) => (
                    <p key={t._id} className="text-sm text-gray-700">
                      {t.name || "Unnamed"} — <span className="text-green-600">{t.email}</span>
                    </p>
                  ))}
              </div>
            </details>
          </div>

          {/* Subject */}
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />

          {/* Message */}
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            rows={4}
          />

          <button
            onClick={sendEmail}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Drop a collection here...</p>
      )}
      </div>
    </div>
  );
}



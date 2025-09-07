"use client";
import { useState, useEffect } from "react";

const DragHandleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

export default function CollectionsTab() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCollections = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/collection");
      if (!res.ok) {
        throw new Error("Failed to fetch collections");
      }
      const data = await res.json();
      setCollections(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching collections:", err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/v1/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to add collection");
      }
      
      setName("");
      await fetchCollections();
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding collection:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Collections</h2>
        <p className="text-sm text-gray-500 mt-1">
          Drag and drop to reorder your collections.
        </p>
      </div>

      <div className="max-h-80 overflow-y-auto pr-2 mb-4">
        {collections.length > 0 ? (
          <ul>
            {collections.map((c: any) => (
              <li
                key={c._id}
                draggable
                className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-gray-50 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 cursor-move"
              >
                <span className="font-medium text-gray-700">{c.name}</span>
                <DragHandleIcon />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">No collections found. Add one below!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            placeholder="New Collection Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Adding..." : "Add Collection"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}


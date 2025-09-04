import React, { useState } from "react";

const Modal = ({ show, onClose, onSend, selectedCount }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  if (!show) return null;

  const handleSend = () => {
    if (!subject || !message) return alert("Please fill all fields");
    onSend(subject, message);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-6 relative animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-4">Send Email</h2>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
          >
            Send to {selectedCount} Student(s)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;


"use client";
import { useState } from "react";

// Simple 'X' icon for removing recipients
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function EmailTab() {
  const [recipients, setRecipients] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    try {
      // NOTE: Assuming the dragged item's data is set as a JSON string.
      // In your Student/Collection tabs, onDragStart should look like:
      // onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify(item))}
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      
      // Add recipient only if it's not already in the list
      if (data && !recipients.some((r) => r._id === data._id)) {
        setRecipients((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error("Could not parse dropped data:", error);
    }
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r._id !== id));
  };
  
  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipients.length === 0 || !message.trim()) return;

    setIsLoading(true);
    setSendStatus("idle");

    try {
      const response = await fetch("http://localhost:5000/api/v1/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, message }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setSendStatus("success");
      setRecipients([]);
      setMessage("");
      setTimeout(() => setSendStatus("idle"), 4000); // Reset message after 4s
    } catch (error) {
      console.error(error);
      setSendStatus("error");
      setTimeout(() => setSendStatus("idle"), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const dropzoneClasses = `p-6 border-2 border-dashed rounded-lg mb-4 min-h-[120px] transition-colors duration-200 ${
    isDraggingOver
      ? "border-indigo-500 bg-indigo-50"
      : "border-gray-300 bg-gray-50"
  }`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Compose Email</h2>
        <p className="text-sm text-gray-500 mt-1">
          Drag items from other tabs to add recipients.
        </p>
      </div>

      <form onSubmit={sendEmail}>
        <div>
          <label className="font-semibold text-gray-700 mb-2 block">
            Recipients
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDraggingOver(true)}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            className={dropzoneClasses}
          >
            {recipients.length === 0 ? (
              <p className="text-gray-400 text-center">
                Drag Students or Collections here
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recipients.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center gap-2 bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    <span>{r.name || r.email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(r._id)}
                      className="text-indigo-500 hover:text-indigo-800"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="message" className="font-semibold text-gray-700 mb-2 block">
            Message
          </label>
          <textarea
            id="message"
            rows={8}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            placeholder="Type your email message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            {sendStatus === "success" && (
              <p className="text-green-600 font-medium">Email sent successfully!</p>
            )}
            {sendStatus === "error" && (
              <p className="text-red-500 font-medium">Something went wrong.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || recipients.length === 0 || !message.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </form>
    </div>
  );
}


import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  FolderKanban,
  Mail,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    collections: 0,
    emails: 0,
  });

  // ✅ Protect route + fetch stats from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Example fetch stats API (backend endpoint bana lenge later)
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-700 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-4 flex-1">
          <button
            onClick={() => navigate("/admin/teachers")}
            className="flex items-center gap-2 hover:bg-green-600 p-2 rounded w-full"
          >
            <Users size={18} /> Teachers
          </button>
          <button
            onClick={() => navigate("/admin/students")}
            className="flex items-center gap-2 hover:bg-green-600 p-2 rounded w-full"
          >
            <GraduationCap size={18} /> Students
          </button>
          <button
            onClick={() => navigate("/admin/collections")}
            className="flex items-center gap-2 hover:bg-green-600 p-2 rounded w-full"
          >
            <FolderKanban size={18} /> Collections
          </button>
          <button
            onClick={() => navigate("/admin/emails")}
            className="flex items-center gap-2 hover:bg-green-600 p-2 rounded w-full"
          >
            <Mail size={18} /> Emails
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 w-full py-2 rounded font-semibold flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Teachers
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.teachers}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Students
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.students}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Collections
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.collections}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Emails Sent
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.emails}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




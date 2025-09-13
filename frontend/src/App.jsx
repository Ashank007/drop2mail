import { Routes, Route, Navigate } from "react-router-dom";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTeachers from  "./pages/AdminTeachers"
import AdminStudents from "./pages/AdminStudents";

export default function App() {
  return (
    <Routes>
      {/* Teacher Routes */}
      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/students" element={<AdminStudents />} />
      <Route path="/admin/teachers" element={<AdminTeachers />} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/teacher/login" replace />} />
    </Routes>
  );
}



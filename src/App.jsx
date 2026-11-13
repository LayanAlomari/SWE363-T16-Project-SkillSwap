import { Routes, Route, Navigate } from "react-router-dom";

// Authentication pages (Razan)
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User pages (Layan)
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import MyServices from "./pages/user/MyServices";

// Each team member adds the routes for their own pages below.
export default function App() {
  return (
    <Routes>
      {/* Temporary: send "/" to Login until the Home page is added */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User pages (Layan) */}
      <Route path="/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/my-services" element={<ProtectedRoute role="user"><MyServices /></ProtectedRoute>} />
    </Routes>
  );
}

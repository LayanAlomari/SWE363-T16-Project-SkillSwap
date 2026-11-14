import { Routes, Route, Navigate } from "react-router-dom";

// Authentication pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User pages
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import MyServices from "./pages/user/MyServices";
import Requests from "./pages/user/Requests";
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";
import Wallet from "./pages/user/Wallet";
import PageLayout from "./components/common/PageLayout";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";

export default function App() {
  return (
    <Routes>
      {/* "/" redirects to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User pages */}
      <Route path="/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/my-services" element={<ProtectedRoute role="user"><MyServices /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute role="user"><Requests /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute role="user"><EditProfile /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute role="user"><Wallet /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute role="user"><PageLayout><Notifications /></PageLayout></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute role="user"><PageLayout><Messages /></PageLayout></ProtectedRoute>} />
      {/* Other members' profiles can be viewed without logging in */}
      <Route path="/users/:id" element={<Profile />} />
    </Routes>
  );
}

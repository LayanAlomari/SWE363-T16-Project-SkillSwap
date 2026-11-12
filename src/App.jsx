import { Routes, Route, Navigate } from "react-router-dom";

// Authentication pages (Razan)
import Login from "./pages/auth/Login";

// Each team member adds the routes for their own pages below.
export default function App() {
  return (
    <Routes>
      {/* Temporary: send "/" to Login until the Home page is added */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

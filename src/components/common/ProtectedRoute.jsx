import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

// Only lets the right people open a page.
// - Not logged in -> sent to the Login page (NFR 07)
// - Wrong role (e.g. a user opening an admin page) -> sent to their own dashboard (NFR 09)
// Usage: <ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>
export default function ProtectedRoute({ role, children }) {
  const { currentUser } = useApp();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }
  return children;
}

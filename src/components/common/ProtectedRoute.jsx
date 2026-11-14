import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

// Only lets the right users open a page:
// - not logged in -> Login page
// - wrong role -> their own dashboard
export default function ProtectedRoute({ role, children }) {
  const { currentUser } = useApp();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }
  return children;
}
